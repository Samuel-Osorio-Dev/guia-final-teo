const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  let query = 'SELECT * FROM juegos WHERE 1=1';
  let params = [];

  Object.entries(req.query).forEach(([key,value])=>{
    query += ` AND ${key}=?`;
    params.push(value);
  });

  db.all(query, params, (err, rows) => {
    res.json({ success:true, total:rows.length, data:rows });
  });
});

router.get('/:id',(req,res)=>{
  db.get('SELECT * FROM juegos WHERE id=?',[req.params.id],(err,row)=>{
    if(!row) return res.status(404).json({success:false,message:'No encontrado'});
    res.json({success:true,data:row});
  });
});

router.post('/',(req,res)=>{
  const {nombre,genero,precio}=req.body;

  if(!nombre || !genero || isNaN(precio)){
    return res.status(400).json({success:false,message:'Datos inválidos'});
  }

  db.run('INSERT INTO juegos(nombre,genero,precio) VALUES (?,?,?)',
  [nombre,genero,precio],
  function(){
    res.status(201).json({success:true,message:'Juego creado',data:{id:this.lastID}});
  });
});

router.put('/:id',(req,res)=>{
  const {nombre,genero,precio}=req.body;

  db.run('UPDATE juegos SET nombre=?,genero=?,precio=? WHERE id=?',
  [nombre,genero,precio,req.params.id],
  function(){
    if(this.changes===0) return res.status(404).json({success:false,message:'No encontrado'});
    res.json({success:true,message:'Actualizado'});
  });
});

router.delete('/:id',(req,res)=>{
  db.run('DELETE FROM juegos WHERE id=?',[req.params.id],function(){
    if(this.changes===0) return res.status(404).json({success:false,message:'No encontrado'});
    res.json({success:true,message:'Eliminado'});
  });
});

module.exports = router;