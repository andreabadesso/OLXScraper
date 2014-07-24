"use strict";var API_ENDPOINT="/",app=angular.module("olxprecoApp",["ngCookies","ngResource","ngSanitize","ngRoute","angles"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angles=angular.module("angles",[]);angles.chart=function(a){return{restrict:"A",scope:{data:"=",options:"=",id:"@",width:"=",height:"=",resize:"=",chart:"@"},link:function(b,c){var d=c[0].getContext("2d"),e=!1;b.size=function(){b.width<=0?(c.width(c.parent().width()),d.canvas.width=c.width()):(d.canvas.width=b.width||d.canvas.width,e=!0),b.height<=0?(c.height(c.parent().height()),d.canvas.height=d.canvas.width/2):(d.canvas.height=b.height||d.canvas.height,e=!0)},b.$watch("data",function(c){if(c){if(b.chart&&(a=b.chart),e)b.size(),f=new Chart(d);else if(!c)return;f[a](b.data,b.options)}},!0),b.resize&&(angular.element(window).bind("resize",function(){b.size(),f=new Chart(d),f[a](b.data,b.options)}),b.$on("$destroy",function(){angular.element(window).off()})),b.size();var f=new Chart(d)}}},angles.directive("chart",function(){return angles.chart()}),angles.directive("linechart",function(){return angles.chart("Line")}),angles.directive("barchart",function(){return angles.chart("Bar")}),angles.directive("radarchart",function(){return angles.chart("Radar")}),angles.directive("polarchart",function(){return angles.chart("PolarArea")}),angles.directive("piechart",function(){return angles.chart("Pie")}),angles.directive("doughnutchart",function(){return angles.chart("Doughnut")}),angles.directive("donutchart",function(){return angles.chart("Doughnut")}),angular.module("olxprecoApp").controller("MainCtrl",["$scope","$http",function(a,b){function c(){switch(a.selecionado.id){case 1:a.aviso=!1,a.dados.sete=_.filter(a.dados.sete,function(b){return isNaN(b.preco)&&(a.aviso=!0),!isNaN(Number(b.preco))}),a.data={labels:_.pluck(a.dados.sete,"data"),datasets:[{fillColor:"rgba(0,118,190,0.1)",strokeColor:"rgba(0,118,190,1)",pointColor:"rgba(220,220,220,1)",pointStrokeColor:"#0076BE",data:_.chain(a.dados.sete).pluck("preco").map(function(a){return Number(a)}).filter(function(a){return a>0}).value()}]},a.precoMedio=(_.reduce(a.data.datasets[0].data,function(a,b){return a+b},0)/a.data.datasets[0].data.length).toFixed(2),a.data.datasets[0].data.length<7&&(a.aviso=!0),a.menorPreco=_.min(a.data.datasets[0].data,function(a){return a}).toFixed(2);break;case 2:a.aviso=!1,a.dados.quinze=_.filter(a.dados.quinze,function(b){return isNaN(b.preco)&&(a.aviso=!0),!isNaN(b.preco)}),a.data={labels:_.pluck(a.dados.quinze,"data"),datasets:[{fillColor:"rgba(0,118,190,0.1)",strokeColor:"rgba(0,118,190,1)",pointColor:"rgba(220,220,220,1)",pointStrokeColor:"#0076BE",data:_.chain(a.dados.quinze).pluck("preco").map(function(a){return isNaN(a)?1e3:Number(a)}).filter(function(a){return a>0}).value()}]},a.data.datasets[0].data.length<15&&(a.aviso=!0),a.precoMedio=(_.reduce(a.data.datasets[0].data,function(a,b){return a+b},0)/a.data.datasets[0].data.length).toFixed(2),a.menorPreco=_.min(a.data.datasets[0].data,function(a){return a}).toFixed(2);break;case 3:a.aviso=!1,a.dados.trinta=_.filter(a.dados.trinta,function(a){return!isNaN(a.preco)}),a.data={labels:_.pluck(a.dados.trinta,"data"),datasets:[{fillColor:"rgba(0,118,190,0.1)",strokeColor:"rgba(0,118,190,1)",pointColor:"rgba(220,220,220,1)",pointStrokeColor:"#0076BE",data:_.chain(a.dados.trinta).pluck("preco").map(function(a){return isNaN(a)?1e3:Number(a)}).filter(function(a){return a>0}).value()}]},a.data.datasets[0].data.length<30&&(a.aviso=!0),a.precoMedio=(_.reduce(a.data.datasets[0].data,function(a,b){return a+b},0)/a.data.datasets[0].data.length).toFixed(2),a.menorPreco=_.min(a.data.datasets[0].data,function(a){return a}).toFixed(2)}}a.mostrarGrafico=!1,a.options={bezierCurve:!0,pointDotRadius:4,animationSteps:45},a.categorias=[{nome:"Celulares e Tablets",id:1,ativa:!0},{nome:"Eletrônicos e Informática",id:2,ativa:!1},{nome:"Bebês e Crianças",id:3,ativa:!1},{nome:"Para sua casa",id:4,ativa:!1},{nome:"Moda e Beleza",id:5,ativa:!1},{nome:"Esportes",id:6,ativa:!1},{nome:"Música, Arte e Lazer",id:7,ativa:!1},{nome:"Animais",id:8,ativa:!1},{nome:"Veículos",id:9,ativa:!1}],a.selecionarCategoria=function(a){_.each(this.categorias,function(a){a.ativa=!1}),a.ativa=!0},a.opcoes=[{name:"Últimos 7 dias",id:1},{name:"Últimos 15 dias",id:2},{name:"Últimos 30 dias",id:3}];var d=[];d[1]="7",d[2]="15",d[3]="30",a.selecionado=a.opcoes[0],a.buscar=function(){if(void 0===this.nome_produto||""===this.nome_produto){var d=angular.element(angular.element.find(".form_nome")[0]).addClass("animated shake");return setTimeout(function(){d.removeClass("animated shake")},800),!1}if(void 0===this.localizacao_produto||""===this.localizacao_produto){var d=angular.element(angular.element.find(".form_sel")[0]).addClass("animated shake");return setTimeout(function(){d.removeClass("animated shake")},800),!1}a.aviso=!1;var e=_.findWhere(this.categorias,{ativa:!0});b({method:"GET",url:API_ENDPOINT+"ofertas/"+a.nome_produto+"/"+e.id}).success(function(b){a.dados=b,c(),a.mostrarGrafico=!0}).error(function(){})},a.$watch("selecionado",function(){c()})}]);