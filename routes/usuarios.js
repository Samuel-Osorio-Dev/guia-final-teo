const express = require('express');
const router = express.Router();
const db = require('../db');

// GET con filtros
router.get('/', (req, res) => {
  let query = 'SELECT * FROM usuarios WHERE 1=1';
  let params = [];

  Object.entries(req.query).forEach(([key, value]) => {
    query += ` AND ${key} = ?`;
    params.push(value);
  });

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success:false, message:'Error BD' });

    res.json({ success:true, total: rows.length, data: rows });
  });
});

// GET por id
router.get('/:id', (req,res)=>{
  db.get('SELECT * FROM usuarios WHERE id=?',[req.params.id],(err,row)=>{
    if(!row) return res.status(404).json({success:false,message:'No encontrado'});
    res.json({success:true,data:row});
  });
});

// POST
router.post('/',(req,res)=>{
  const {nombre,email}=req.body;

  if(!nombre || !email){
    return res.status(400).json({success:false,message:'Faltan datos'});
  }

  db.get('SELECT * FROM usuarios WHERE email=?',[email],(err,ex)=>{
    if(ex) return res.status(400).json({success:false,message:'Email ya existe'});

    db.run('INSERT INTO usuarios(nombre,email) VALUES (?,?)',[nombre,email],function(){
      res.status(201).json({success:true,message:'Usuario creado',data:{id:this.lastID}});
    });
  });
});

// PUT
router.put('/:id',(req,res)=>{
  const {nombre,email}=req.body;

  db.run('UPDATE usuarios SET nombre=?,email=? WHERE id=?',
  [nombre,email,req.params.id],
  function(){
    if(this.changes===0) return res.status(404).json({success:false,message:'No existe'});
    res.json({success:true,message:'Actualizado'});
  });
});

// DELETE
router.delete('/:id',(req,res)=>{
  db.run('DELETE FROM usuarios WHERE id=?',[req.params.id],function(){
    if(this.changes===0) return res.status(404).json({success:false,message:'No existe'});
    res.json({success:true,message:'Eliminado'});
  });
});

module.exports = router;