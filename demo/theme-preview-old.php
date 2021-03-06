<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Chess Boards on a Web Page- DHTML Chess</title>

    <style type="text/css">
        /* Demo css rules */
        body {
            background-color: #039BE5 !important;
            -webkit-font-smoothing: antialiased;
            color: #333;
            font: 15px "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif;
        }

        nav ul {
            padding: 0;
        }

        nav#main {
            border-radius: 5px;
        }

        nav#main li a:hover, nav#main li.current a, nav#main .searchform {
            background: none;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0.1) 0 1px 0;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.25);
            color: #fff;
            text-shadow: rgba(0, 0, 0, 0.796875) 0 -1px 0, rgba(255, 255, 255, 0.296875) 0 0 10px;
        }

        nav ul, nav ol {
            list-style: none;
            list-style-image: none;
        }

        nav#main li a {
            color: #fff;
            text-decoration: none;
            padding: 6px 10px;
            display: block;
            border: 1px solid transparent;
            text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.76);
        }

        nav#main ul {
            margin: 0;
            float: left;
            padding-top: 10px;
            padding-bottom: 10px;
        }

        nav#main li {
            float: left;
            font: normal normal 16px "klavika-web", "Helvetica Neue", Helvetica, Arial, Geneva, sans-serif;
            margin-right: 2px;
        }

        .menu {
            background-color: #01579B;
            padding: 10px;
            border-radius: 5px;

            display: block;
        }

        .body {
            background-color: #FFF;
            padding: 10px;
        }

        .footer {
            background-color: #01579B;
            padding: 10px;
            color: #FFF;
            font-size: 0.8em;
        }


    </style>
    <!-- DHTML CHESS Part 1-->
    <script type="text/javascript" src="../jquery/jquery-3.1.0.min.js"></script>
    <script type="text/javascript" src="../js/dhtml-chess-minified.js"></script>
    <link rel="stylesheet" href="../css/dhtml-chess-all.css" type="text/css">
    <!-- This is the brown theme. All chess board styles are defined in this theme
    -->
    <script type="text/javascript" src="../src/view/board/gui.js"></script>
    <script type="text/javascript" src="../src/view/board/board.js"></script>
    <script type="text/javascript" src="../src/view/board/background.js"></script>

    <?php

    $theme = isset($_GET["theme"]) ? preg_replace("/[^0-9a-z_\-]/si", "", $_GET["theme"]) : "wood1";
    $pieces = isset($_GET["pieces"]) ? preg_replace("/[^0-9a-z_\-]/si", "", $_GET["pieces"]) : "svg_bw";
    ?>
    <script type="text/javascript" src="../themes/<?php echo $theme; ?>.js"></script>
    <script type="text/javascript" src="js/demo-theme-2.js"></script>
    <link rel="stylesheet" href="../css-source/buttonbar/light-gray.css" type="text/css">
    <script type="text/javascript">
    chess.THEME['chess.view.board.Board'].pieceLayout='<?php echo $pieces; ?>';
    </script>
    <!-- End DHTML Chess part 1 -->
</head>

<!--

NOTICE THAT THE BODY HAS BEEN ASSIGNED TO CSS CLASS ludo-twilight.

This is the theme used for DHTML Chess.

Other options are ludo-light-gray, ludo-gray and ludo-blue
-->
<body>

<div class="content">

    <div class="header">
        <img src="images/sample-heading.png">
    </div>
    <div class="menu">

        <nav id="main">
            <div>
                <ul id="menu-top" class="menu">
                    <li class="menu-item"><a href="#">Download</a></li>
                    <li class="menu-item"><a href="#">Learn</a></li>
                    <li class="menu-item"><a href="#">Samples</a></li>
                    <li class="menu-item"><a href="#">License</a></li>
                    <li class="menu-item"><a href="#">Contact</a></li>
                    <li class="menu-item"><a href="#">Forums</a></li>
                </ul>

                <div style="clear:both"></div>
            </div>
            <div style="clear:both"></div>
        </nav>
    </div>

    <div class="body">
        <h1>World Championship 1927, Alekhine vs Capablanca</h1>
        <p>This page illustrates the use of themes in DHTML Chess. The chess widgets will be
            styled based on included theme.</p>
        <!--
        DHTML Chess part 2
        -->
        <h4>Game 1</h4>
        <div style="min-height:450px" class="dhtmlchess" data-dhtmlchess-pgn="WorldChamp1927" data-dhtmlchess-game="1">
        </div>
        <h4>Game 2</h4>
        <p>The second game ended in a draw.</p>
        <div style="min-height:450px" class="dhtmlchess" data-dhtmlchess-pgn="WorldChamp1927"
             data-dhtmlchess-game="2"></div>

        <h4>Game 3</h4>
        <p>The third game ended in a draw.</p>
        <div style="min-height:650px" id="dhtml-chess" class="ludo-twilight"></div>

        <script type="text/javascript">

            jQuery(document).ready(function () {
                var moduleId = 'chess-' + String.uniqueID();

                new chess.view.Chess({
                    renderTo: '#dhtml-chess', // render it to the div above
                    css: {
                        border: '1px solid #ddd'
                    },
                    layout: {
                        height: 'matchParent', width: 'matchParent', // Use full width and height */
                        type: 'linear', orientation: 'horizontal' // render list of games, board and notations beneath each other
                    },
                    children: [ // Array of child views, i.e. list of games board and notations
                        {
                            layout: {
                                width: 350,
                                type: 'Docking',
                                tabs: 'left'
                            },
                            css: {
                                'border-right': '1px solid ' + ludo.$C('border')
                            },
                            children: [
                                {
                                    title: 'Games',
                                    id: 'gameListView',
                                    layout: {
                                        visible: false
                                    },
                                    module: moduleId,
                                    type: 'chess.view.gamelist.Grid', // A game list view
                                    css: {
                                        'overflow-y': 'auto'
                                    },
                                    loadMessage: 'Loading Games',
                                    dataSource: {
                                        url: '../router.php', // The dhtml chess php file which handles loading of games
                                        type: 'chess.dataSource.PgnGames', // A pgn data source. the data source loads game data from the server
                                        "listeners": {
                                            "load": function (data) {
                                                // when games has been loaded, show first game
                                                if (data.length) {
                                                    ludo.get('gameListView').selectRecord(data[0]);
                                                }
                                            }
                                        }
                                    },
                                    cols: ['white', 'black', 'result'],
                                    elCss: {
                                        'border-bottom': '1px solid #aaa'
                                    }
                                }
                            ]

                        },
                        {
                            layout: {
                                type: 'linear', orientation: 'vertical',
                                weight: 1
                            },
                            children: [
                                {

                                    /*
                                     * Chess board view
                                     */
                                    type: 'chess.view.board.Board',
                                    module: moduleId,
                                    padding: '3%',
                                    layout: {
                                        height: 'wrap'

                                    },
                                    background: {
                                        borderRadius: '1%'
                                    },
                                    plugins: [

                                        {
                                            type: 'chess.view.highlight.Arrow',
                                            styles: {
                                                'stroke': '#aaa',
                                                'stroke-opacity': .8,
                                                'stroke-width': 1
                                            }
                                        }
                                    ]
                                },
                                {
                                    /** Game Navigation buttons */
                                    type: 'chess.view.buttonbar.Bar',
                                    module: moduleId,
                                    elCss: {
                                        margin: 2
                                    },
                                    height: 30
                                },
                                {
                                    /** Notation panel */
                                    type: 'chess.view.notation.Panel',
                                    module: moduleId,
                                    layout: {
                                        height: 150
                                    }
                                }

                            ]
                        }

                    ]

                });

                new chess.controller.Controller({
                    applyTo: [moduleId]
                });


                ludo.$('gameListView').selectPgn('WorldChamp1927');
            });

        </script>


        <!--
        END DHTML Chess Part 2
        -->
        <h4>Notation Styling</h4>
        <p>The notations are styled using the following CSS rules:</p>
        <ul>
            <li><strong>.chess-move-group</strong>: Styling of a pair of moves(example: 1 e4 e5). The default styling
                is display:inline-block to prevent line break in the middle
            </li>
            <li><strong>.chess-move-number</strong>: Styling of the number in front of a move.</li>
            <li><strong>.notation-chess-move:</strong>: Styling of a move(example: e4)</li>
        </ul>
    </div>
    <div class="footer">
        Footer of Web page &copy; dhtmlchess.com
    </div>


</div>
<script type="text/javascript" class="google-analytics">
    var hostname = location.hostname.toLowerCase();
    if (hostname.indexOf('dhtml-chess.com') >= 0) {
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-34147162-1']);
        _gaq.push(['_trackPageview']);

        (function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    }
</script>
</body>
</html>