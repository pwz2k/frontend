Chart.elements.Rectangle.prototype.draw=function(){var t,e,i,h,r,o,a,d=this._chart.ctx,n=this._view,l=n.borderWidth;if(n.horizontal?(t=n.base,e=n.x,i=n.y-n.height/2,h=n.y+n.height/2,r=e>t?1:-1,o=1,a=n.borderSkipped||"left"):(t=n.x-n.width/2,e=n.x+n.width/2,i=n.y,r=1,o=(h=n.base)>i?1:-1,a=n.borderSkipped||"bottom"),l){var g=Math.min(Math.abs(t-e),Math.abs(i-h)),s=(l=l>g?g:l)/2,v=t+("left"!==a?s*r:0),b=e+("right"!==a?-s*r:0),w=i+("top"!==a?s*o:0),c=h+("bottom"!==a?-s*o:0);v!==b&&(i=w,h=c),w!==c&&(t=v,e=b)}d.beginPath(),d.fillStyle=n.backgroundColor,d.strokeStyle=n.borderColor,d.lineWidth=l;var u=[[t,h],[t,i],[e,i],[e,h]];this._chart.config.data.datasets[this._datasetIndex].data[this._index]<0&&(u=[[t,i],[t,h],[e,i],[e,h]]);var C=["bottom","left","top","right"].indexOf(a,0);function f(t){return u[(C+t)%4]}-1===C&&(C=0);var T=f(0);d.moveTo(T[0],T[1]);for(var p=1;p<4;p++){var m;T=f(p),nextCornerId=p+1,4==nextCornerId&&(nextCornerId=0),nextCorner=f(nextCornerId),width=u[2][0]-u[1][0],height=u[0][1]-u[1][1],x=u[1][0],y=u[1][1],(m=6)>height/2&&(m=height/2),m>width/2&&(m=width/2),d.moveTo(x+m,y),d.lineTo(x+width-m,y),d.quadraticCurveTo(x+width,y,x+width,y+m),d.lineTo(x+width,y+height-m),d.quadraticCurveTo(x+width,y+height,x+width-m,y+height),d.lineTo(x+m,y+height),d.quadraticCurveTo(x,y+height,x,y+height-m),d.lineTo(x,y+m),d.quadraticCurveTo(x,y,x+m,y)}d.fill(),l&&d.stroke()};