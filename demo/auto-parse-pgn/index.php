<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Demo - Auto generate PGN</title>

    <script type="text/javascript">
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

    <?php
    date_default_timezone_set("Europe/Berlin");

    ?>

    <script type="text/javascript" src="../../jquery/jquery-3.1.0.min.js"></script>
    <script type="text/javascript" src="../../js/dhtml-chess.js?rnd=4"></script>
    <script type="text/javascript" src="../../src/controller/controller.js?rnd=3"></script>
    <script type="text/javascript" src="../../src/controller/analysis-controller.js?rnd=3"></script>
    <script type="text/javascript" src="../../garbochess-engine/garbochess.js"></script>
    <script type="text/javascript" src="../../src/view/score/bar.js?rnd=4"></script>
    <script type="text/javascript" src="../../src/view/board/gui.js?rnd=4"></script>
    <script type="text/javascript" src="../../src/view/board/board.js?rnd=3"></script>
    <script type="text/javascript" src="../../src/view/board/piece.js?rnd=3"></script>
    <script type="text/javascript" src="../../src/controller/stockfish-engine-controller.js?rnd=2"></script>
    <script type="text/javascript" src="../../src/remote/reader.js?rnd=1"></script>
    <script type="text/javascript" src="../../src/model/game.js?rnd=1"></script>
    <script type="text/javascript" src="../../src/remote/game-reader.js?rnd=1"></script>
    <script type="text/javascript" src="../../src/parser0x88/config.js?rnd=1"></script>
    <script type="text/javascript" src="../../src/parser0x88/fen-parser-0x88.js?rnd=1"></script>
    <script type="text/javascript" src="auto-parse.js?rnd=2"></script>
    <script type="text/javascript" src="find-line.js?rnd=3"></script>
    <link rel="stylesheet" href="../../css-source/buttonbar/gray.css" type="text/css">
    <link rel="stylesheet" href="../../css/dhtml-chess-all.css?rnd=2" type="text/css">
    <style type="text/css">
        body, html {
            width: 100%;
            height: 100%;
            font-family: arial !important;
        }

        .dhtml-chess-board-container {
            border: 0;
            background-color: transparent;
        }

        .ludo-view-container {
            background-color: transparent;
        }

        .dhtml-chess-board-label-ranks-container, .dhtml-chess-board-label-files-container {
            color: #aeb0b0;

        }

        .ludo-twilight .notation-chess-move {
            color: #aeb0b0;
            display: inline-block;
            padding: 2px;

        }

        .ludo-twilight span.notation-chess-move-highlighted {
            background-color: #aeb0b0;
            color: #444;
            border-radius: 3px;
        }

        .ludo-twilight .dhtml-chess-board-container {
            background-color: #444;
            border-radius: 10px;
            padding-right: 25px;
            padding-top: 25px;
        }

    </style>

</head>
<body class="ludo-twilight">
<script type="text/javascript">
    ludo.config.setUrl('../../router.php');
    ludo.config.setDocumentRoot('../../');
    ludo.config.setFileUploadUrl('../../router.php');

    var app = new ludo.Application({
        title: 'Analysis board, DHTML Chess 3.0',
        layout: {
            type: 'linear',
            orientation: 'vertical'
        },
        children: [
            {
                id: 'scoreBar',
                css: {
                    'margin': 5
                },
                type: 'chess.view.score.Bar',
                layout: {
                    height: 60
                },
                borderRadius: 5,
                blackColor: '#3E2723',
                whiteColor: '#EEEEEE',
                markerColor: '#B71C1C',
                markerTextColor: '#FFF',
                stroke: '#222222',
                range: 5
            },
            {
                id: 'board',
                type: 'chess.view.board.Board',
                pieceLayout: 'svg3',
                boardLayout: 'wood',
                animationDuration: 0,
                labels: true,
                layout: {
                    weight: 1
                },
                plugins: [
                    {
                        type: 'chess.view.highlight.Arrow'
                    }
                ]

            },
            {
                type: 'chess.view.notation.Panel',
                layout: {
                    height: 100
                },
                css: {
                    "text-align": "center"
                },
                framed: true,
                resizable: false

            },
            {
                type:'ludo.View',
                id:'message',
                layout:{
                    height:20
                },
                css:{
                    'text-align':'center'
                }
            },
            {
                type:'chess.view.metadata.FenField',
                layout:{
                    height:20,
                    width:300,
                    align:'center'
                }
            }
        ]
    });


    var parser = new chess.AutoParse({
        in: "tactic-checkmates",
        "out": "tactic-checkmates.pgn",
        findLastMove:true,
        timeout:240000,
        ///acceptedScore:3,
        checkmatesOnly:true,
       // maxMoves:3,
        append:true,
        startIndex:<?php echo isset($_GET["index"]) ? $_GET["index"] : 802; ?>,
        listeners:{
            score:function(score){
                ludo.$('scoreBar').setScore(score);
            },
            'message':function(message){
                ludo.$('message').html(message);
            }
        }
    });


</script>
</body>
</html>