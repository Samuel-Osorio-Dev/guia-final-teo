const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req,res)=>{
  db.all('SELECT * FROM compras',[],(err,rows)=>{
    res.json({success:true,total:rows.length,data:rows});
  });
});

router.get('/:id',(req,res)=>{
  db.get('SELECT * FROM compras WHERE id=?',[req.params.id],(err,row)=>{
    if(!row) return res.status(404).json({success:false,message:'No encontrado'});
    res.json({success:true,data:row});
  });
});

router.post('/',(req,res)=>{
  const {usuario_id,fecha}=req.body;

  if(!usuario_id || !fecha){
    return res.status(400).json({success:false,message:'Faltan datos'});
  }

  db.get('SELECT * FROM usuarios WHERE id=?',[usuario_id],(err,user)=>{
    if(!user) return res.status(400).json({success:false,message:'Usuario no existe'});

    db.run('INSERT INTO compras(usuario_id,fecha) VALUES (?,?)',
    [usuario_id,fecha],
    function(){
      res.status(201).json({success:true,message:'Compra creada',data:{id:this.lastID}});
    });
  });
});

router.put('/:id',(req,res)=>{
  db.run('UPDATE compras SET usuario_id=?,fecha=? WHERE id=?',
  [req.body.usuario_id,req.body.fecha,req.params.id],
  function(){
    if(this.changes===0) return res.status(404).json({success:false,message:'No encontrado'});
    res.json({success:true,message:'Actualizado'});
  });
});

router.delete('/:id',(req,res)=>{
  db.run('DELETE FROM compras WHERE id=?',[req.params.id],function(){
    if(this.changes===0) return res.status(404).json({success:false,message:'No encontrado'});
    res.json({success:true,message:'Eliminado'});
  });
});

module.exports = router;