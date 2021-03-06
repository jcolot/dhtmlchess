/**
 * Created by alfmagne1 on 26/01/2017.
 */
window.chess.isWordPress = true;

chess.WPEditor = new Class({

    Extends: Events,
    renderTo: undefined,

    offset: undefined,

    initialize: function (config) {
        this.renderTo = jQuery(config.renderTo);
        if (config.docRoot) {
            ludo.config.setDocumentRoot(config.docRoot);
        }

        var b = jQuery(document.body);
        this.offset = jQuery('#wpwrap').offset().top - b.outerHeight() + b.height();

        this.onWinResize();
        this.module = String.uniqueID();

        jQuery(document).ready(this.render.bind(this));
        jQuery(window).on('resize', this.onWinResize.bind(this));
    },

    onWinResize: function () {
        this.renderTo.css('height', (jQuery(document.body).height() - this.offset));
    },

    render: function () {

        jQuery(document.body).addClass('ludo-twilight');
        this.renderTo.addClass('ludo-twilight');

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
                        type: 'linear',
                        orientation: 'horizontal',
                        weight: 1
                    },

                    children: [
                        {
                            module: this.module,
                            css: {
                                'overflow': 'hidden'
                            },
                            submodule: 'wordpress.dockinglayout',
                            layout: {
                                type: 'docking',
                                tabs: 'left',
                                width: 300,
                                resizable: true,
                                minWidth: 50
                            },

                            children: [
                                {
                                    title: chess.__('Game Drafts'),
                                    id: 'draftsDockingView',
                                    type: 'FramedView',
                                    elCss: {
                                        'border-left-width': 0
                                    },
                                    layout: {
                                        type: 'fill'
                                    },
                                    children: [
                                        {
                                            type: 'chess.wordpress.DraftListView',
                                            module: this.module,
                                            css: {
                                                padding: 2
                                            },
                                            dataSource: {
                                                type: 'chess.wordpress.Drafts'
                                            }
                                        }

                                    ]
                                },
                                {
                                    type: 'FramedView',
                                    layout: {
                                        type: 'linear', orientation: 'vertical',
                                        visible: true
                                    },
                                    elCss: {
                                        'border-left-width': 0
                                    },
                                    title: chess.__('PGN Databases'),
                                    children: [
                                        {
                                            type: 'form.Button',
                                            value: chess.__('New Database'),
                                            submodule: 'chess.newDatabaseButton',
                                            module: this.module,
                                            layout: {
                                                width: 'matchParent'
                                            }
                                        },
                                        {
                                            type: 'chess.wordpress.PgnListView',
                                            module: this.module,
                                            layout: {
                                                weight: 1
                                            }
                                        }

                                    ]

                                },
                                {
                                    type: 'FramedView',
                                    titleBar: {
                                        title: chess.__('Games'),
                                        module: this.module,
                                        buttons: [
                                            {
                                                type: 'rename',
                                                title: chess.__('Rename Database'),
                                                icon: ludo.config.getDocumentRoot() + '/images/settings.png?rnd=' + Math.random(),
                                                listener: function () {
                                                    this.controller.renameDatabase();
                                                }
                                            }
                                        ]
                                    },
                                    module: this.module,
                                    submodule: 'wordpress.gamelisttab',
                                    title: chess.__('Games'),
                                    elCss: {
                                        'border-left-width': 0
                                    },
                                    layout: {
                                        type: 'linear', orientation: 'vertical'
                                    },
                                    children: [
                                        {
                                            type: 'form.Text',
                                            placeholder: chess.__('Search'),
                                            id: 'searchField',
                                            layout: {
                                                height: 30
                                            },

                                            listeners: {
                                                key: function (value) {
                                                    ludo.$('gamelistgrid').getDataSource().search(value);
                                                }
                                            },
                                            elCss: {
                                                'border-bottom': '1px solid ' + ludo.$C('border')
                                            }
                                        },
                                        {
                                            id: 'gamelistgrid',
                                            type: 'chess.wordpress.GameListGrid',
                                            module: this.module,
                                            layout: {
                                                weight: 1
                                            }
                                        },
                                        {
                                            layout: {
                                                height: 30,
                                                type: 'linear', orientation: 'horizontal'
                                            },
                                            css: {
                                                'padding-top': 2
                                            },
                                            elCss: {
                                                'border-bottom': '1px solid ' + ludo.$C('border')
                                            },
                                            children: [
                                                {
                                                    weight: 1
                                                },
                                                {
                                                    type: 'paging.First',
                                                    dataSource: 'editor_game_list_ds',
                                                    layout: {
                                                        width: 35
                                                    }
                                                },
                                                {
                                                    type: 'paging.Previous',
                                                    dataSource: 'editor_game_list_ds',
                                                    layout: {
                                                        width: 35
                                                    }
                                                },
                                                {
                                                    type: 'paging.CurrentPage',
                                                    dataSource: 'editor_game_list_ds'
                                                },
                                                {
                                                    type: 'paging.TotalPages',
                                                    dataSource: 'editor_game_list_ds'
                                                },
                                                {
                                                    type: 'paging.Next',
                                                    dataSource: 'editor_game_list_ds',
                                                    layout: {
                                                        width: 35
                                                    }
                                                },
                                                {
                                                    type: 'paging.Last',
                                                    dataSource: 'editor_game_list_ds',
                                                    layout: {
                                                        width: 35
                                                    }
                                                },
                                                {
                                                    weight: 1
                                                }

                                            ]
                                        },
                                        {
                                            elCss: {
                                                'padding-top': 2
                                            },
                                            layout: {
                                                type: 'linear', orientation: 'horizontal',
                                                height:30

                                            },
                                            children: [
                                                {
                                                    type: 'form.Button',
                                                    module: this.module,
                                                    value: chess.__('Standings'),
                                                    submodule: 'wordpress.standingsbutton',
                                                    listeners: {
                                                        rendered: function () {
                                                            if (!this.controller.pgn) {
                                                                this.hide();
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    type: 'form.Button',
                                                    module: this.module,
                                                    value: chess.__('Import PGN'),
                                                    submodule: 'wordpress.importpgn',
                                                    listeners: {
                                                        rendered: function () {
                                                            if (!this.controller.pgn) {
                                                                this.hide();
                                                            }
                                                        }
                                                    }
                                                }

                                            ]

                                        }

                                    ]
                                }
                            ]
                        },
                        {
                            layout: {
                                weight: 1,
                                type: 'linear', orientation: 'vertical'
                            },
                            css: {
                                'border-left': '1px solid ' + ludo.$C('border')
                            },
                            children: [
                                {
                                    type: 'chess.wordpress.EditorHeading',
                                    module: this.module,
                                    layout: {
                                        height: 20
                                    }
                                },

                                {
                                    module: this.module,
                                    type: 'chess.wordpress.MetadataTitle',
                                    css: {
                                        'text-align': 'center'
                                    },
                                    layout: {
                                        height: 45
                                    }
                                },

                                {
                                    type: 'chess.view.board.Board',
                                    module: this.module,
                                    layout: {
                                        weight: 1
                                    },
                                    squareStyles_white: {
                                        'background-color': '#a3a3a3'
                                    },
                                    squareStyles_black: {
                                        'background-color': '#888888'
                                    },
                                    elCss: {
                                        'margin-top': 5,
                                        'margin-bottom': 2

                                    },
                                    background: {
                                        borderRadius: ludo.isMobile ? '0.5%' : '1%',
                                        paint: {
                                            'fill': '#1a2026'
                                        }
                                    },
                                    pieceLayout: 'svg_darkgrey',
                                    labelOddStyles: ludo.isMobile ? {
                                        'color': '#fff'
                                    } : {
                                        'color': '#fff'
                                    },
                                    labelEvenStyles: {
                                        'color': '#fff'
                                    },
                                    labels: !ludo.isMobile,
                                    padding: ludo.isMobile ? '1%' : '3%',
                                    labelPos: ludo.isMobile ? 'inside' : 'outside',
                                    plugins: [
                                        {
                                            type: 'chess.view.highlight.Arrow',
                                            styles: {
                                                'fill': '#f77cc5',
                                                'stroke': '#888'
                                            }
                                        },
                                        {
                                            type: 'chess.view.highlight.ArrowTactic',
                                            styles: {
                                                'fill': '#f77cc5',
                                                'stroke': '#888'
                                            }
                                        },
                                        {
                                            type: 'chess.view.highlight.SquareTacticHint'
                                        }
                                    ]
                                },
                                {
                                    type: 'chess.view.buttonbar.Bar',
                                    elCss: {
                                        'border-bottom': '1px solid ' + ludo.$C('border')
                                    },
                                    layout: {
                                        height: 40
                                    },
                                    buttonSize: function (availSize) {
                                        return availSize * 0.8;
                                    },
                                    module: this.module,
                                    borderRadius: '10%',
                                    styles: {
                                        button: {
                                            fill: '#666',
                                            stroke: '#bbb'
                                        },
                                        image: {
                                            fill: '#ccc'
                                        },
                                        buttonOver: {
                                            fill: '#777',
                                            stroke: '#a3a3a3'
                                        },
                                        imageOver: {
                                            fill: '#eee'
                                        },
                                        buttonDown: {
                                            fill: '#555',
                                            stroke: '#bbb'
                                        },
                                        imageDown: {
                                            fill: '#bbb'
                                        },
                                        buttonDisabled: {
                                            fill: '#888',
                                            'fill-opacity': 0.4,
                                            stroke: '#888'
                                        },
                                        imageDisabled: {
                                            fill: '#555',
                                            'fill-opacity': 0.4
                                        }
                                    }
                                },
                                {

                                    elCss: {
                                        'border-top': '1px solid ' + ludo.$C('border')
                                    },
                                    layout: {
                                        type: 'tabs', tabs: 'top',
                                        height: jQuery(document.body).height() / 4,
                                        resizable: true,
                                        resizePos: 'above'
                                    },
                                    children: [
                                        {
                                            title: 'Notations',
                                            type: 'chess.view.notation.Panel',
                                            showEval: true,
                                            module: this.module,
                                            figurines: 'svg_bw',
                                            showContextMenu: true

                                        },
                                        {
                                            type: 'chess.wordpress.CommentView',
                                            title: chess.__('Annotate'),
                                            module: this.module
                                        },
                                        {
                                            'title': chess.__('Computer Eval'),
                                            type: 'wordpress.ComputerEval',
                                            module: this.module,
                                            layout: {}
                                        },
                                        {
                                            title: chess.__('Metadata'),
                                            module: this.module,
                                            type: 'chess.wordpress.GameMetadata'
                                        }
                                        /*
                                         {
                                         title:'PGN',
                                         module:this.module,
                                         type:'chess.wordpress.PgnParserView'
                                         },
                                         {
                                         title:'Standings',
                                         module:this.module,
                                         type:'chess.wordpress.PgnStandings'
                                         }
                                         */

                                    ]

                                },
                                {
                                    elCss: {
                                        'border-top': '1px solid ' + ludo.$C('border')
                                    },
                                    module: this.module,
                                    type: 'chess.wordpress.WordPressMessage',
                                    layout: {
                                        height: 20
                                    },
                                    css: {
                                        'line-height': '20px'
                                    }
                                }
                            ]
                        }

                    ]
                },
                {
                    layout: {
                        height: 35,
                        type: 'linear',
                        orientation: 'horizontal'

                    },

                    css: {
                        padding: 4,
                        'background-color': ludo.$C('border')
                    },
                    children: [
                        {
                            module: this.module,
                            submodule: 'wordpress.newgame',
                            type: 'form.Button',
                            value: chess.__('New Game'),
                            layout: {width: 80}
                        },
                        {
                            module: this.module,
                            submodule: 'wordpress.newposition',
                            type: 'form.Button',
                            value: chess.__('New Position'),
                            layout: {width: 120}
                        },
                        {
                            layout: {
                                weight: 1, height: 25
                            }
                        },
                        {
                            type: 'chess.wordpress.UpdateGameButton',
                            module: this.module,
                            layout: {
                                width: 80
                            }
                        },
                        {
                            module: this.module,
                            hidden: true,
                            type: 'chess.wordpress.DiscardDraftButton',
                            layout: {
                                width: 80
                            }
                        },
                        {
                            type: 'chess.wordpress.PublishButton',
                            module: this.module,
                            layout: {
                                width: 80
                            }
                        },
                        {
                            type: 'chess.wordpress.DraftButton',
                            module: this.module,
                            layout: {
                                width: 80
                            }
                        }
                    ]
                }

            ]


        });

        this.controller = new chess.wordpress.WordpressController({
            applyTo: [this.module],
            garboChess: ludo.config.getDocumentRoot() + '/garbochess/js/garbochess.js'    // Path to garbochess.js, relative to this file
        });
    }
});