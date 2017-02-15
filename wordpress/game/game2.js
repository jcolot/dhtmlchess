chess.WPGame2 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize: undefined,

    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();
        this.renderTo.css('height', w + 275);
        this.boardSize = w;
        this.render();
    },

    render: function () {
        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        height: 35,
                        width: this.boardSize
                    },
                    module: this.module,
                    type: 'chess.view.metadata.Game',
                    tpl: '{white} - {black}',
                    cls: 'metadata',
                    css: {
                        'text-align': 'center',
                        'overflow-y': 'auto',
                        'font-size': '1.2em',
                        'font-weight': 'bold'
                    }
                },

                Object.merge({
                    boardLayout: undefined,
                    id: 'tactics_board',
                    type: 'chess.view.board.Board',
                    module: this.module,
                    overflow: 'hidden',
                    pieceLayout: 'svg3',
                    boardCss: {
                        border: 0
                    },
                    labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                    labelPos: 'outside', // show labels inside board, default is 'outside'
                    layout: {
                        weight: 1,
                        height: 'wrap'
                    },
                    plugins: [
                        Object.merge({
                            type: 'chess.view.highlight.Arrow'
                        }, this.arrow)
                    ]
                }, this.board),
                {
                    type: 'chess.view.buttonbar.Bar',
                    layout: {
                        height: 40,
                        width: this.boardSize
                    },
                    module: this.module
                },
                {
                    id: this.module + '-panel',
                    name: "notation-panel",
                    type: 'chess.view.notation.Panel',
                    layout: {
                        height: 200
                    },
                    elCss: {
                        'margin-left': '2px'
                    },
                    module: this.module

                }
            ]
        });

        this.controller = new chess.controller.Controller({
            applyTo: [this.module]
        });

        this.loadGame();

    }

});