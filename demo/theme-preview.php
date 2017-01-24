<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />
    <title>Theme Preview - all views</title>
    <script type="text/javascript" src="../jquery/jquery-3.1.0.min.js"></script>
    <script type="text/javascript" src="../js/dhtml-chess-minified.js"></script>
    <script type="text/javascript" src="../../ludojs/src/layout/tabs.js"></script>
    <script type="text/javascript" src="../../ludojs/src/svg/util.js"></script>
    <link rel="stylesheet" href="../css/dhtml-chess-all.css" type="text/css">
    <link rel="stylesheet" href="../css/overrides.css" type="text/css">

    <?php
 
    $theme = isset($_GET["theme"]) ? $_GET["theme"] : "wood1";

    $pieces = isset($_GET["pieces"]) ? preg_replace("/[^0-9a-z_\-]/si", "", $_GET["pieces"]) : "svg_bw";


    ?>
    <script type="text/javascript" src="js/demo-theme-2.js"></script>
    <link rel="stylesheet" href="../css-source/buttonbar/light-gray.css" type="text/css">
    <link rel="stylesheet" href="../themes/<?php echo $theme; ?>.css"/>
    <script type="text/javascript" src="../themes/<?php echo $theme; ?>.js"></script>
    <script type="text/javascript">
        chess.THEME['chess.view.board.Board'].pieceLayout='<?php echo $pieces; ?>';

        function renderView(renderTo, config) {

            new chess.view.Chess({
                renderTo: renderTo,
                layout: {
                    type: 'fill',
                    width: 'matchParent', height: 'matchParent'
                },
                children: [config]
            });

        }
    </script>
</head>
<body>

<div id="board-bg" style="height:500px"></div>
<script type="text/javascript">
    renderView('#board-bg', {
        type: 'chess.view.board.Board',
        layout: {
            width: 'matchParent', height: 'matchParent'
        }
    });
</script>

<div id="notation-panel" style="height:200px"></div>
<script type="text/javascript">
    renderView('#board-bg', {
        type: 'chess.view.notation.Panel',
        renderTo: '#notation-panel',
        layout: {
            width: 'matchParent', height: 'matchParent'
        }
    });
</script>

<div id="games" style="height:300px"></div>
<script type="text/javascript">
    renderView('#games', {
        layout: {
            weight: 1
        },
        type: 'chess.view.gamelist.Grid',
        elCss:{
            border: '1px solid ' + chess.THEME.borderColor
        },
        css: {
            'overflow-y': 'auto',

        },
        dataSource: {
            id: 'gameList',
            "type": 'chess.dataSource.PgnGames',
            postData: {
                "arguments": "Morphy"
            },
            "listeners": {
                "load": function (data) {
                    if (data.length) {
                        ludo.$('gameList').selectRecord(data[0]);
                    }
                }
            },
            shim: {
                txt: 'Loading games'
            },
            paging: {
                size: 25,
                pageQuery: false,
                cache: false,
                cacheTimeout: 1000
            }
        },
        cols: ['white', 'black', 'result', 'event', 'site']
    });
</script>

<div id="window-preview" style="width:350px;height:350px"></div>
<script type="text/javascript">
    var d = new chess.view.dialog.Promote({
        layout: {
            centerIn: '#window-preview'
        },
        module: 'none',
        modal: false
    });
    d.show();
    d.setColor('white');
</script>
<div id="window-preview2" style="width:350px;height:250px"></div>
<script type="text/javascript">
    var d = new chess.view.dialog.PuzzleSolved({
        layout: {
            centerIn: '#window-preview2'
        },
        title:'Puzzle Solved!',
        html:'Good Job, puzzle is solved',
        module: 'none',
        modal: false
    });
    d.show();
</script>

<div id="tab-preview" style="height:300px"></div>
<script type="text/javascript">
    renderView(
        '#tab-preview',
        {
            type: 'View',
            css:{
                border: '1px solid ' + chess.THEME.borderColor
            },
            layout: {
                type: 'tab',
                tabs: 'top',
                width: 'matchParent', height: 'matchParent'
            },
            children: [
                {
                    title: 'First tab',        type:'chess.view.gamelist.Grid',
                    css:{
                        'overflow-y':'auto'
                    },
                    dataSource:{
                        id:'gameList',
                        "type":'chess.dataSource.PgnGames',
                        postData:{
                            "arguments" : "Morphy"
                        },
                        "listeners":{
                            "load": function(data){

                                if(data.length){
                                    ludo.$('gameList').selectRecord(data[0]);
                                }
                            }
                        },
                        shim:{
                            txt : 'Loading games'
                        },
                        paging:{
                            size:25,
                            pageQuery:false,
                            cache:false,
                            cacheTimeout:1000
                        }
                    },
                    cols:['white', 'black', 'result', 'event', 'site']

                },
                {title: 'Second tab'}
            ]
        }
    )
</script>

<script type="text/javascript">
    $(document).ready(function () {
        var controller = new chess.controller.Controller();
    });
</script>

</body>
</html>