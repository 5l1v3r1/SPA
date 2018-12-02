const express = require('express');
const router=express.Router();
const mongodb=require('../../app');
const R =require('r-script');
const fs = require("fs");
//router에 의해 바로 경로가 main folder기준으로 잡힘 시작 
//api call ip:port/spa/~~~
(function Test()
{ 
  //   fs.readFileSync(__dirname+'/../r_script/ex-sync.R',function(err,data){
  //   console.log(data);
  // });

  // fs.readFileSync('/home/dke_exp/Desktop/git/spa_v1/Exp_Server/apps/r_script/ex-sync.R','utf-8',function(err,data){
  //   console.log(data);
  // });

  // fs.readFile('/home/dke_exp/Desktop/git/spa_v1/Exp_Server/apps/r_script/ex-sync.R','utf8',function(error,data){
  // if(error){
  //   console.error('ReadFile Error : ', exception);
  // }else{
  //   console.log(data);
  // }
  // });

  //   fs.readFile(__dirname+'/../r_script/ex-sync.R','utf8',function(error,data){
  // if(error){
  //   console.error('ReadFile Error : ', exception);
  // }else{
  //   console.log(data);
  // }
  // });
  //  R("/home/dke_exp/Desktop/git/spa_v1/Exp_Server/apps/r_script/ex-sync.R")
  // .data("hello world",20)
  // .call(function(err, d) {
  //   if (err) throw err;
  //   console.log(d);
  // });

  // R("ex-async.R")
  // .data("hello world",20)
  // .call(function(err, d) {
  //   if (err) throw err;
  //   console.log(d);
  // });

var path=__dirname+'/../r_script/ex-sync.R';
console.log(path);
  //console.log(__dirname);

var out = R("ex-sync.R").data("hello world", 20).callSync();
console.dir(out);
console.log(out);


var out = R('/home/dke_exp/Desktop/git/spa_v1/Exp_Server/apps/r_script/ex-sync.R').data("hello world", 20).callSync();

console.dir(out);  
console.log(out);


var out = R("test.R")
  .data("hello world", 20)
  .callSync();

console.dir(out);  
console.log(out);

}());


//main page
router.get('/',function(req,res){
  res.render('main');
});
//predict page
router.get('/predict',function(req,res){
  mongodb.connect.models.Refine_EdisonSetData.find(function(err,Refine_EdisonSetData){
    let cluster_set=new Set();
    let array;
    
    if(err)
    {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    for(let i=0;i<Refine_EdisonSetData.length;i++)
    {
    cluster_set.add(Refine_EdisonSetData[i].cluster);
    }
    array=Array.from(cluster_set);
    console.log(array);
    res.render('predict',{cluster:array});
  });
});
//body -- poset params -- get

//--- predict API list ---//
//get cluster
router.get('/clusters',function(req,res){
  mongodb.connect.models.Refine_EdisonSetData.find(function(err,Refine_EdisonSetData){
    let cluster_set=new Set();
    let array;
    
    if(err)
    {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    for(let i=0;i<Refine_EdisonSetData.length;i++)
    {
      cluster_set.add(Refine_EdisonSetData[i].cluster);
    }
    array=Array.from(cluster_set);
    console.log(array);
    //res.render('predict',{cluster:array});
    res.json(array);
  });
});

//get scienceAppName -from cluster
router.get('/clusters/:cluster_name',function(req,res){
  mongodb.connect.models.Refine_EdisonSetData.find({'cluster':req.params.cluster_name},function(err,Refine_EdisonSetData){
    let scienceAppName_set=new Set();
    let array;

    console.log(req.body.cluster_name);
    console.log(req.params.cluster_name);
    if(err)
    {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    for(let i=0;i<Refine_EdisonSetData.length;i++)
    {
    scienceAppName_set.add(Refine_EdisonSetData[i].scienceAppName);
    }
    array=Array.from(scienceAppName_set);
    console.log(array);
    res.json(array);
  });
});


//get param -from cluster,scienceAppName
router.get('/clusters/:cluster_name/:scienceAppName',function(req,res){
  mongodb.connect.models.Refine_EdisonSetData.find({'scienceAppName':req.params.scienceAppName},function(err,Refine_EdisonSetData){
    let param_set=new Set();
    let array;

    console.log(req.params.scienceAppName);
    if(err)
    {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    for(let i=0;i<Refine_EdisonSetData.length;i++)
    {
      param_set.add(Refine_EdisonSetData[i].parameter);
    }
    array=Array.from(param_set);
    console.log(array);
    res.json(array);
  });
});
http://155.230.34.149:3000/spa/clusters/EDISON-CFD/2D_Incomp_P/parameters_values?par[]=test1&par[]=test2&par[]=test3&var[]=var1&var[]=var2&var[]=var3
//ex http://155.230.34.149:3000/spa/clusters/EDISON-CFD/2D_Incomp_P/value?par[]=test1&par[]=test2&par[]=test3
//requset result predict result
router.get('/clusters/:cluster_name/:scienceAppName/parameters_values',function(req,res){
  let c=req.params.cluster_name;
  let p=req.params.scienceAppName;
  let e=req.params.values;

  console.log(R);
  console.log(c);
  console.log(p);
  console.log(req.query.par);
  console.log(req.query.var);

  var out=R("../r_script/ex-sync.R")
    .data("hello world",20)
    .callSync();

  console.log(out); 
  res.json(out);
});


//------///


router.get('/topic/new',function(req,res){
  fs.readdir('data',function(err,files){
    if(err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
    }
     res.render('new',{topics:files});
  });
});


router.get(['/topic','/topic/:id'],function(req,res){ //maybe this aprt will be database (read) 첫번쨰인자 배열도 가능
  fs.readdir('data',function(err,files){
    if(err) {
    console.log(err);
    res.status(500).send('Internal Server Error1');
    }
    let id=req.params.id;
    if(id)
    {
    //id 값이 잇을떄 
      fs.readFile('data'+id,'utf8',function(err,data){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error2');
      }
      res.render('view',{title:id,topics:files,description:data});
      });
     }//id 값이 없을떄 
    else{
    res.render('view',{topics:files,title:'Welcome',description:'Hello, SPA'}); //filepath, send obejct to file
  }
  });
});
  
router.post('/topic',function(req,res){
	console.log(req.body);
  let title=req.body.title;
  let desc=req.body.description;

  fs.writeFile('data'+title,desc,function(err){ // maybe this part will be database(write)..!
    if(err){
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/'+title); //redirect 첫번쨰인자 url로 다시보낸다/ 
    //res.send('Hi, topic post '+title+' '+desc);
  });

});

//api+html example
router.get('/template',function(req,res){
  res.render('temp',{time:Date(),_title:'Jade'}); //temp file rendering -> send to web views에 있는 거 참조
  //2번쨰 인자에 객체전잘 하면 temp.jade 사용 가능 
}); 
router.get('/multi',function(req,res){//query string ex
  res.send(req.query.id+','+req.query.name); //home/topic?id=~~ or name etc...
  //155.230.34.149:3000/topic?name=pew&id=1
});

var topic=['SPA','DKE','Help ME'];
router.get('/topics',function(req,res){//query string ex
  var output=`
  <a href="/topic?id=0">SPAman</a><br>
  <a href="/topic?id=1">DKEMANS</a><br>
  <a href="/topic?id=2">Help..</a><br>
  ${topic[req.query.id]}
  `
  res.send(output);
  //res.send(topic[req.query.id]); //home/topic?id=~~ or name etc...
  //155.230.34.149:3000/topic?name=pew&id=1
});


router.get('/test/:id',function(req,res){ //semantic url 기존에 내가쓰던 /~/~
    var output=`
  <a href="/test/0">SPAman</a><br>
  <a href="/test/1">DKEMANS</a><br>
  <a href="/test/2">Help..</a><br>
  ${topic[req.params.id]}
  `
  res.send(output); //rest api시는 결국 얘해야함 
});
router.get('/test/:id/:mode',function(req,res){
  res.send(req.params.id+' '+req.params.mode);
})

router.get('/form',function(req,res){
  res.render('form');
});
router.get('/form_receiver',function(req,res){
  var title=req.query.title;
  var desc=req.query.description;
  res.send(title+' '+desc);
})
router.post('/form_receiver',function(req,res){ //post method
  var title=req.body.title; //post 시 query가 아니라 body post는 url에 표현이 안된다 
  var desc=req.body.description;
  res.send('post '+title+' '+desc);
});

router.get('/',function(req,res){
  res.send('Hello World');
}); //home dir 들어올경우 function 

router.get('/login',function(req,res){
  res.send('<h1>login plz</h1>');
}); //login dir 들어올경우 function  //get -> router 요청에대해 중계해주는 역할 



router.get('/dynamic',function(req,res){//javascript+html을 통해 정적인 코드 
  var lis='';
  for(var i=0;i<5;i++){
    lis=lis+'<li>coding</li>';
  }
  //` 작은따옴표아님
  var time=Date();
  var output=`
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    DKE LAB SPA PROJECT! Dynamic ver
    <ul>
      ${lis}
    </ul>
      ${time}
  </body>
</html>`;
  res.send(output)
})

module.exports=router; 