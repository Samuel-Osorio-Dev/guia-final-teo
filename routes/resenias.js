const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/',(req,res)=>{
  db.all('SELECT * FROM detalle_compras',[],(err,rows)=>{
    res.json({success:true,total:rows.length,data:rows});
  });
});

router.post('/',(req,res)=>{
  const {compra_id,juego_id}=req.body;

  if(!compra_id || !juego_id){
    return res.status(400).json({success:false,message:'Faltan datos'});
  }

  db.get('SELECT * FROM compras WHERE id=?',[compra_id],(err,c)=>{
    if(!c) return res.status(400).json({success:false,message:'Compra no existe'});

    db.get('SELECT * FROM juegos WHERE id=?',[juego_id],(err,j)=>{
      if(!j) return res.status(400).json({success:false,message:'Juego no existe'});

      db.run('INSERT INTO detalle_compras(compra_id,juego_id) VALUES (?,?)',
      [compra_id,juego_id],
      function(){
        res.status(201).json({success:true,message:'Detalle creado',data:{id:this.lastID}});
      });
    });
  });
});

router.delete('/:id',(req,res)=>{
  db.run('DELETE FROM detalle_compras WHERE id=?',[req.params.id],function(){
    if(this.changes===0) return res.status(404).json({success:false,message:'No encontrado'});
    res.json({success:true,message:'Eliminado'});
  });
});

module.exports = router;