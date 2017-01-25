<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 12:40
 */
class DhtmlChessDatabaseImportPgn
{
    public function __construct(){
        
    }

    public function appendPgn($pgnFilePath){
        if(!file_exists($pgnFilePath)){
            throw new DhtmlChessException("Pgn file not found");
        }
        try{
            $pgn = DhtmlChessDatabasePgn::instanceByName($pgnFilePath);
            
            $parser = new PgnParser($pgnFilePath);
            $games = $parser->getGames();
            foreach($games as $game){
                $pgn->appendGame($game);
            }

            return $pgn;
            
        }catch(DhtmlChessException $e){
            return $this->import($pgnFilePath);
        }
        
    }

    public function importPgnString($pgnName, $pgnString){
        $parser = new PgnParser();
        $parser->setPgnContent($pgnString);
        return $this->finishImport($pgnName, $parser);
    }

    public function import($filePath){

        if(!file_exists($filePath)){
            throw new Exception("PGN DOES NOT EXISTS");
        }
        $parser = new PgnParser($filePath);

        return $this->finishImport($filePath, $parser);
    }

    /**
     * @param string $name
     * @param PgnParser $parser
     * @return DhtmlChessDatabasePgn
     */
    private function finishImport($name, $parser){

        $games = $parser->getGames();

        $util = new DhtmlChessDatabasePgnUtil();

        $pgn = $util->create($name);

        foreach($games as $game){
            $pgn->appendGame($game);
        }
        
        return $pgn;
    }



    
}