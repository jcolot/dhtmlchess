window.chess.isWordPress = true;

chess.WPTactics2 = new Class({
    Extends: chess.WPTemplate,
    boardSize: undefined,
    random: false,

    gameFinished: false,

    startTime: undefined,

    lastGameId: undefined,

    gameIndex: 0,

    storageKey: undefined,

    validateGameData: false,
    storage: undefined,

    movesSolved: 0,

    inHintMode: false,

    __construct: function (config) {
        this.parent(config);
        var r = this.renderTo;
        var w = this.renderWidth();
        r.css('height', Math.round(w + 164 + this.wpm_h));
        this.boardSize = w;
        if (config.random !== undefined) this.random = config.random;

        if (this.renderTo.substr && this.renderTo.substr(0, 1) !== "#") this.renderTo = "#" + this.renderTo;

        var id = String.uniqueID();
        this.avId = 'av' + id;
        this.eloId = 'elo' + id;
        this.nextBtnId = 'btn' + id;
        this.reloadBtnId = 'btn_r' + id;
        this.hintBtnId = 'hint' + id;
        this.clockId = 'clk' + id;
        this.iconId = 'icon' + id;
        this.colorViewId = 'clr' + id;
        this.beforeRender();
    },

    nextGame: function () {
        this.loadedFromHistory = false;
        if (this.random) {
            this.controller.loadRandomGame();
        } else {
            this.loadNextGame();
        }
    },

    render: function () {

        new chess.view.Chess({
            cls: this.th,
            theme: this.themeObject,
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'fill',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        type: 'linear', orientation: 'vertical'
                    },
                    children: [
                        {
                            layout: {
                                height: 34
                            },
                            id: this.colorViewId,
                            type: 'chess.ColorView'
                        },
                        Object.merge({
                            boardLayout: undefined,
                            id: this.boardId,
                            animationDuration: this.animationDuration,
                            type: 'chess.view.board.Board',
                            module: this.module,
                            overflow: 'hidden',
                            pieceLayout: 'svg3',
                            boardCss: {
                                border: 0
                            },
                            labelPos: this.lp,
                            layout: {
                                height: this.boardSize
                            },
                            plugins: [
                                Object.merge({
                                    type: 'chess.view.highlight.Arrow'
                                }, this.arrow),
                                Object.merge({
                                    type: 'chess.view.highlight.ArrowTactic'
                                }, this.arrowSolution),
                                Object.merge({
                                    type: 'chess.view.highlight.SquareTacticHint'
                                }, this.hint)
                            ]
                        }, this.board),
                        {
                            height: 48,
                            cls: 'wpc-user-info-panel',
                            layout: {
                                type: 'linear', orientation: 'horizontal'
                            },
                            children: [
                                {
                                    type: 'chess.UserAvatarView',
                                    id: this.avId,
                                    auto: false,
                                    layout: {
                                        width: 48, height: 'matchParent'
                                    }
                                },
                                {
                                    module: this.module,
                                    type: 'chess.UserElo',
                                    id: this.eloId,
                                    css: {
                                        'line-height': '40px'
                                    },
                                    layout: {
                                        weight: 1, height: 'matchParent'
                                    }
                                },
                                {
                                    id: this.clockId,
                                    type: 'chess.Clock',
                                    layout: {
                                        weight: 1, height: 'matchParent'
                                    }
                                }
                            ]
                        },
                        {
                            layout: {
                                height: 48, type: 'linear', orientation: 'horizontal'
                            },
                            children: [
                                {
                                    id: this.iconId,
                                    type: 'chess.IconView',
                                    layout: {
                                        width: 48,
                                        height: 'matchParent'
                                    }
                                },
                                {
                                    weight: 1
                                },
                                {
                                    id: this.reloadBtnId,
                                    type: 'chess.ImageButton',
                                    img: this.dr + 'images/reload.png',
                                    layout: {
                                        width: 80,
                                        height: 'matchParent'
                                    },
                                    btnVisible: false,
                                    listeners: {
                                        'click': this.reloadGame.bind(this)
                                    }
                                },
                                {
                                    id: this.nextBtnId,
                                    type: 'chess.ImageButton',
                                    img: this.dr + 'images/btn-next.png',
                                    layout: {
                                        width: 80,
                                        height: 'matchParent'
                                    },
                                    btnVisible: false,
                                    listeners: {
                                        'click': this.nextGame.bind(this)
                                    }
                                },
                                {
                                    id: this.hintBtnId,
                                    type: 'chess.ImageButton',
                                    img: this.dr + 'images/hint.png',
                                    layout: {
                                        width: 80,
                                        height: 'matchParent'
                                    },
                                    btnVisible: false,
                                    listeners: {
                                        'click': this.showSolution.bind(this)
                                    }
                                }

                            ]
                        }
                    ]
                }
            ]
        });

        this.storageKey = 'wordpresschess_user_tactics'  + this.pgnAll.map(function(pgn){ return pgn.id }).join("_");

        this.controller = new chess.controller.Controller({
            applyTo: [this.module],
            pgn: this.pgnId(),
            sound: this.sound,
            autoMoveDelay: 400,
            noDialogs: true,
            eventHandler: this.eventHandler.bind(this)
        });

        this.loadUserInfo();
    },

    showSolution: function () {
        this.inHintMode = true;
        ludo.$(this.hintBtnId).hideButton();
        ludo.$(this.clockId).stop();
        this.controller.playMoves();

    },

    loadNextGame: function () {
        this.validateGameData = true;
        this.loadGame(this.getIndex() + 1);
    },

    getIndex: function () {
        return this.storageVal('index', 0);
    },

    loadGame: function (index) {

        jQuery.ajax({
            url: this.url,
            method: 'post',
            cache: false,
            dataType: 'json',
            data: {
                action: 'game_by_index_strict',
                pgn: this.pgnId(),
                index: index
            },
            complete: function (response, success) {
                this.gameFinished = false;
                if (success) {
                    var json = response.responseJSON;

                    if (json.success) {
                        this.onGameLoaded(json.response);
                    } else {
                        var pgnId = this.nextPgnId();

                        this.pgnId(pgnId);
                        this.saveStorageVal('index', 0);
                        this.loadGame(0);
                    }

                }
            }.bind(this)
        });
    },

    onGameLoaded: function (model) {

        this.inHintMode = false;

        var gameId = model.id;
        var pgnId = model.pgn_id;
        var index = model.index;

        this.curModel().populate(model);

        ludo.$(this.eloId).clearIncs();
        ludo.$(this.hintBtnId).showButton();

        this.saveStorageVal('id', gameId);
        this.pgnId(pgnId);
        this.saveStorageVal('index', index);

        this.movesSolved = 0;

        this.updateServerStore();
    },

    updateServerStore: function () {
        jQuery.ajax({
            url: this.url,
            method: 'post',
            cache: false,
            dataType: 'json',
            data: {
                action: 'wpc_save_tactics_data',
                pgn: this.pgnId(),
                gameId: this.storageVal('id'),
                index: this.storageVal('index')
            }
        });
    },


    pgnId: function (val) {
        if (arguments.length === 1) {
            this.saveStorageVal('pgn', val);
            return;
        }
        return this.storageVal('pgn', this.pgn.id);
    },

    nextPgnId: function () {
        var pgn = this.pgnId();
        var index = 0;
        jQuery.each(this.pgnAll, function (i, pgnObj) {
            if (pgnObj.id == pgn) {
                index = i;
            }
        });

        if (index < this.pgnAll.length - 1) {
            index++;
        } else {
            index = 0;
        }

        return this.pgnAll[index].id;
    },

    reloadGame: function () {

        this.curModel().toStart();

        ludo.$(this.iconId).animateOut();

        var clk = ludo.$(this.clockId);

        ludo.$(this.hintBtnId).showButton();

        clk.reset();
        clk.start();
    },

    myColor: undefined,


    eventHandler: function (event, model, controller, move) {

        var b = controller.views.board;

        if (event === 'correctGuess') {
            this.movesSolved++;
        }

        if (event === 'boardMove') {
            controller.currentModel.tryNextMove(move);
        }

        if (event === 'newGame') {
            var result = model.getResult();
            if (result == -1) {
                b.flipToBlack();
                this.myColor = 'black';
            } else {
                b.flipToWhite();
                this.myColor = 'white';
            }

            if (model.model.moves.length > 0) {
                var clk = ludo.$(this.clockId);
                clk.reset();
                clk.start();
            }

            ludo.$(this.iconId).animateOut();

            ludo.$(this.nextBtnId).hideButton();
            ludo.$(this.reloadBtnId).hideButton();
            ludo.$(this.colorViewId).hideView();
        }

        if (!this.inHintMode && (event === 'setPosition' || event === 'nextmove')) {
            colorToMove = model.getColorToMove();
            if (colorToMove === this.myColor) {
                b.enableDragAndDrop(model);
            } else {
                model.nextMove.delay(200, model);
            }
        }


        if (event === 'wrongGuess') {
            this.onGameEnd(true);
        }

        if (event === 'endOfBranch') {
            this.onGameEnd();
        }
    },

    getStorage: function () {
        if (this.storage === undefined) {
            var storage = ludo.getLocalStorage().get(this.storageKey);
            this.storage = storage ? storage : {};
        }
        return this.storage;
    },

    saveStorageVal: function (key, val) {
        var s = this.getStorage();
        s[key] = val;
        ludo.getLocalStorage().save(this.storageKey, s);
    },

    storageVal: function (key, defaultVal) {
        var s = this.getStorage();
        return s[key] !== undefined ? s[key] : defaultVal;
    },

    onGameEnd: function (wasWrong) {

        if (!wasWrong) this.movesSolved++;


        ludo.$(this.hintBtnId).hideButton();

        var src = wasWrong ? 'incorrect-icon.png' : this.inHintMode ? 'solved-skipped.png' : 'solved-icon.png';
        ludo.$(this.iconId).setIcon(this.dr + 'images/' + src);


        if (this.gameFinished)return;

        var clk = ludo.$(this.clockId);
        clk.stop();

        this.gameFinished = true;

        var moves = this.controller.getCurrentModel().model.moves.length;
        var ms = clk.elapsed();
        var solved = !wasWrong;

        var cv = ludo.$(this.colorViewId);
        cv.showView();
        if (solved) {
            cv.colorCls(this.inHintMode ? 'wpc-tactics-skipped' : 'wpc-tactics-solved');
            cv.icon(this.dr + 'images/solved-icon-white.png');
        } else {
            cv.colorCls('wpc-tactics-failed');
            cv.icon(this.dr + 'images/incorrect-icon-white.png');
        }


        jQuery.ajax({
            url: this.url,
            method: 'post',
            cache: false,
            dataType: 'json',
            data: {
                action: 'wpc_puzzle_complete',
                moves: moves,
                solvedMoves: this.inHintMode ? moves / 2 : this.movesSolved,
                rated: !this.inHintMode,
                solved: solved && !this.inHintMode ? 1 : 0,
                ms: ms,
                puzzleId: this.controller.currentModel.getId()
            },
            complete: function (response, success) {
                this.gameFinished = false;
                if (success) {
                    var json = response.responseJSON;
                    var elo = json.response;

                    ludo.$(this.eloId).val(elo);

                    ludo.$(this.nextBtnId).showButton();
                    ludo.$(this.reloadBtnId).showButton();
                }
            }.bind(this)
        });

        this.inHintMode = false;

    },

    showStartButton: function () {
        var v = this.startButton = jQuery('<div class="dhtml_chess_overlay_parent"><div class="dhtml_chess_overlay"></div><div class="dhtml_chess_overlay_image wpc-start-button-large"></div></div>');
        ludo.$(this.boardId).boardEl().append(v);

        v.on('click', this.loadFirstGame.bind(this));
    },

    showLogOnWarning: function () {
        ludo.$(this.clockId).reset();

        var v = jQuery('<div class="dhtml_chess_overlay_parent"><div class="dhtml_chess_overlay"></div><div class="dhtml_chess_overlay_image wpc-login-image"></div></div>');
        ludo.$(this.boardId).boardEl().append(v);

        v.css('cursor', 'pointer');

        v.on('click', function () {
            location.href = ludo.config.wpRoot + '?redirect_to=' + encodeURI(location.href);
        });
    },


    loadFirstGame: function () {

        this.startButton.remove();
        if (this.random) {
            this.controller.loadRandomGame();
        } else {
            this.loadGame(this.getIndex());
        }
    },


    loadUserInfo: function () {
        jQuery.ajax({
            url: this.url,
            method: 'post',
            cache: false,
            dataType: 'json',
            data: {
                action: 'wpc_userinfo',
                size: 32
            },
            complete: function (response, success) {
                if (success) {
                    var json = response.responseJSON.response;

                    if (json.id === 0) {
                        this.showLogOnWarning();
                        return;
                    }

                    if (json.tactics) {
                        var t = json.tactics;
                        if (t.pgn && this.isValidPgn(t.pgn)) {
                            this.pgnId(t.pgn);
                            this.saveStorageVal("id", t.gameId);
                            this.saveStorageVal("index", t.index);
                        }
                    }

                    ludo.$(this.avId).setAvatar(json.avatar);
                    ludo.$(this.eloId).val(json.puzzleelo);

                    this.showStartButton();


                } else {
                }

            }.bind(this)
        });
    }
});