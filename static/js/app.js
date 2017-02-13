
$(function(){
	setTimeout(initMain,10);

});


/* mainpage start */

var nav={
	data:{
		items:[],
		stack:[],
		itemDict:{},
		getMenus:function(){
			return $(".mainpage .menupanel .tab_item");
		},
		getTabs:function(){
			return $(".mainpage #header .nav ul li");
		},
		getContents:function(){
		    return $(".mainpage #main .content_item");
		},
		setMainMenu:function(nav){
			var $menupanel=$(".mainpage .menupanel");
			var $menuFocus=$menupanel.find("#menuFocus");
			var $more = $menupanel.find(".more");
			nav.data.closeMenu=function(mm){
				if(nav.data.isCanCloseMenu==true){
					mm=mm||50;
					$menupanel.fadeOut(mm);
				}
				else{
					$menuFocus.focus();
				}
			};
			$(".mainpage #header .nav_menu").click(function(e){
				e.stopPropagation();
				nav.data.isCanCloseMenu=true;
				if($menupanel.css("display")!="none"){
					$menupanel.fadeOut(100);
				}
				var $This=$(this);
				var offset=$This.offset();
				var _left=Math.max(0,offset.left-$menupanel.outerWidth()+$This.outerWidth());
				var _top=offset.top+$This.height();
				$menupanel.css({top:_top,left:_left}).show();
				$menuFocus.focus();
			});
			$menuFocus.focusout(function(e){
				nav.data.closeMenu(500);
			});
			$more.hover(function(e){
				nav.data.isCanCloseMenu=false;
			},function(e){
				nav.data.isCanCloseMenu=true;
				$menuFocus.focus();
			});

			$(".mainpage .menupanel .close-all").click(function(e){
				nav.removeAll2();
				//setTimeout(function(){$menupanel.hide()},100);
			});

		},
		isCanCloseMenu:true,
		max:10
	},
	init:function(opt){
		var _opt=$.extend({},this._default);
		for(var index in _opt.items){
			this.add(_opt.items[index]);
		}

		this.select(_opt.selectId);

		this.data.setMainMenu(this);

	},
	message:function(msg){
		alert(msg);
	},
	
	add:function(opt){
		var This=this;
		if(!opt || this.get(opt)<0){
			return;
		}
		opt.index=this.data.items.length;
		if(opt.index>this.data.max){
			this.message("菜单过多，请先删除再打开！");
			return;
		}
		opt.id=opt.id||(new Date().getTime().toString());
		opt.url=opt.url||"#";
		opt.name=opt.name||"";

		var _item=this.data.itemDict[opt.id];
		if(_item ===undefined){
			_item={};
			_item.tabElem=this.addTab(opt);
			_item.menuElem=this.addMenu(opt);
			//_item.contentElem=this.addContent(opt);
			_item.id=opt.id;
			_item.name=opt.name;
			_item.url=opt.url;
			this.data.items.push(_item);
			this.data.itemDict[opt.id]=_item;

			//bind event
			//_item.tabElem.find("a").attr("onclick","nav.select('"+_item.id+"');return false;");
			_item.tabElem.find("a").click(function(e){
				This.select(_item.id);
				return false;
			});
			_item.tabElem.find("span").click(function(e){
				This.remove(_item.id);
			});
			_item.menuElem.click(function(e){
				This.select(_item.id);
			});
			_item.menuElem.find("a").click(function(e){
				//e.stopPropagation();
				This.remove(_item.id);
				return false;
			});
		}
	},
	addTab:function(opt){
		var $oldelem=this.data.getTabs().filter("[content_id="+opt.id+"]");
		if($oldelem.length>0){
			return $oldelem;
		}
		//$oldelem.remove();
		var $newli=$("<li></li>");
		$newli.html("<a></a><span>x</span>");
		var $a=$newli.find("a");
		$a.attr("title",opt.name);
		$a.attr("href",opt.url);
		$a.attr("content_id",opt.id);
		$a.text(opt.name);
		$newli.attr("content_id",opt.id);
		$newli.insertBefore($(".mainpage #header .nav ul li.nav_menu"));
		return $newli;
    },
	addMenu:function(opt){
		var $oldelem=this.data.getMenus().filter("[content_id="+opt.id+"]");
		if($oldelem.length>0){
			return $oldelem;
		}
		//$oldelem.remove();
		var $newdiv=$("<div></div>");
		$newdiv.html("<span class='text'></span>");
		var $span=$newdiv.find("span");
		$span.text(opt.name);
		$newdiv.append("<a>x</a>");
		$newdiv.addClass("item");
		$newdiv.addClass("tab_item");
		$newdiv.attr("title",opt.name);
		$newdiv.attr("href",opt.url);
		$newdiv.attr("content_id",opt.id);
		$newdiv.appendTo($(".mainpage .menupanel .tab_items"));
		return $newdiv;
    },
	addContent:function(opt){
		var $oldelem=this.data.getContents().filter("[content_id="+opt.id+"]");
		if($oldelem.length>0){
			return $oldelem;
		}
		//$oldelem.remove();
		var $newdiv=$("<div></div>");
		if(opt.url!="#" && opt.url !=""){
			var iframe = document.createElement("iframe");
			iframe.name = "iframe_" + opt.id;
			iframe.src = opt.url;
			$newdiv.append(iframe);
		}
		//$newdiv.attr("title",opt.name);
		$newdiv.attr("class","content_item hide");
		$newdiv.attr("content_id",opt.id);
		$newdiv.appendTo($(".mainpage #main"));
		return $newdiv;
    },
	addAndSelect:function(opt){
		this.add(opt);
		this.select(opt);
	},
	remove:function(id){
		var item=this.data.itemDict[id];
		if(item){
			delete this.data.itemDict[id];
			for(var i=0,l=this.data.items.length;i<l;i++){
				if(this.data.items[i]== item){
					this.data.items.splice(i,1);
					break;
				}
			}
			item.tabElem.remove();
			item.menuElem.remove();
			item.contentElem && item.contentElem.remove();
			for(var key in item){
				delete item[key];
			}
			var stack = this.data.stack;
			for(var i=0,l=stack.length;i<l;i++){
				if(stack[i]===id){
					stack.splice(i,1);
					break;
				}
			}
			if(stack.length>0){
				this.select(stack[stack.length-1]);
			}
		}
    },
	removeAll2:function(){
		for(var key in this.data.itemDict){
			if(key == "0"){
				continue;
			}
			this.remove(key);
		}
    },
	get:function(id){
		return this.data.itemDict[id];
	},
	select:function(id){
		var item = this.get(id);
		if($.type(item)=="object" && item.id==id){
			item.contentElem=this.addContent({id:item.id,url:item.url,name:item.name});
			this.data.getTabs().removeClass("selected");
			item.tabElem.addClass("selected");
			this.data.getMenus().removeClass("selected");
			item.menuElem.addClass("selected");
			this.data.getContents().addClass("hide");
			item.contentElem.removeClass("hide");

			var stack = this.data.stack;
			for(var i=0,l=stack.length;i<l;i++){
				if(stack[i]===id){
					stack.splice(i,1);
					break;
				}
			}
			stack.push(id);

		}
    },
	_default:{
		 items:[{name:"首页",id:"0",url:"#"}],
		 selectId:"0"
	}
};

function initMain(){
	//debug
	//console.log(nav);
	nav._default.items.push({
		id:"__baidu__",
		name:"百度",
		url:"http://www.baidu.com"
	});
	nav._default.items.push({
		id:"__zhihu__",
		name:"知乎",
		url:"http://www.zhihu.com"
	});
	nav._default.items.push({
		id:"__cnblogs__",
		name:"博客园",
		url:"http://www.cnblogs.com"
	});
	nav.init();
	
	//sidebar
	$("#sidebar .top .title").click(function(e){
		var $This = $(this);
		if($This.is(".open")){
			$This.siblings("ul").addClass("hide");
			$This.removeClass("open");
		}
		else{
			$This.siblings("ul").removeClass("hide");
			$This.addClass("open");
		}
	});

	$("#sidebar .top .title2").click(function(e){
		var $This = $(this);
		if($This.is(".open2")){
			$This.siblings("ul").addClass("hide");
			$This.removeClass("open2");
		}
		else{
			$This.siblings("ul").removeClass("hide");
			$This.addClass("open2");
		}
	});

	$("#sidebar .top .item").click(function(e){
		var $This = $(this);
		if($This.is(".title") || $This.is(".title2")){
			return;
		}
		var $text=$This.find(".text");
		var opt={};
		opt.id = $text.attr("content_id");
		opt.name = $text.text();
		opt.url = $text.attr("href");
		nav.add(opt);
		nav.select(opt.id);
		return false;
	});

	//change
	var $changePanel = $(".mainpage .changePanel");
	var $changeFocus = $changePanel.find("#changeFocus");
	$changeFocus.focusout(function(){
		$changePanel.fadeOut(500);
	});
	$("#header .top .item a").click(function(){
		if($changePanel.css("display")!="block"){
			var $This = $(this);
			var offset=$This.offset();
			$changePanel.css({top:offset.top+$This.outerHeight(),left:offset.left})
			$changePanel.css("display","block");
		}
		else{
			$changePanel.css("display","none");
		}
		$changeFocus.focus();
	});

	$changePanel.find(".title span").click(function(){
		$changePanel.css("display","none");
	});

	$changePanel.find("li").click(function(){
		var $This =$(this);
		var xxxId=$This.attr("xxxid");
		// 切换XXX
		
		$changePanel.css("display","none");
	});


	//IE6 style
	$(".mainpage #sidebar,.mainpage .changePanel li,#sidebar .top .item,.mainpage .menupanel .item").hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});

	$(".mainWrap").width($("body").width()-$(".sidebarWrap").outerWidth());
	$(".centerWrap").height($("body").height()-$(".headerWrap").outerHeight());

}

/* mainpage end */

$(window).resize(function(e){
	var $This = $(this);
	//alert("width:"+$This.width()+"height:"+$This.height());
	$(".mainWrap").width($("body").width()-$(".sidebarWrap").outerWidth());
	$(".centerWrap").height($("body").height()-$(".headerWrap").outerHeight());
});

