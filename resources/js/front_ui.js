var frontUI = function() {
	var me = this;
	var isMobile;
	me.desk = matchMedia("(min-width: 1280px)");
	me.tablet = matchMedia("(max-width: 1279px)");
	me.mobile = matchMedia("(max-width: 1023px)");
	me.body = $("body");
	me.scrollbarWidth = window.innerWidth - $("body").width(); //modal Background ScrollBar
	me.scrollTop;

	$(document).ready(function(){
		me.firstLoad();

		$(".formgroup .inpbox input").focus(function() { 
			if(this.value == this.defaultValue) {
				this.value = "";
			}
			var myLabelParent = $(this).parent().parent().parent();
			myLabelParent.addClass("focusIn");
		}).blur(function() {
			if(!this.value.length) {
				this.value = this.defaultValue;
				var myLabelParent = $(this).parent().parent().parent();
				myLabelParent.removeClass("focusIn");
			}
		});

		$('.ui-datepicker-prev').prepend('이전 월로 이동');
		$('.ui-datepicker-next').prepend('다음 월로 이동');

		$.datepicker.setDefaults($.datepicker.regional['kr']);
		$(".datebox input.nm-datepicker").datepicker({
			showOn: "both",
			changeMonth: true,
			changeYear: true,
			showOtherMonths: true,
			selectOtherMonths: true,
			dateFormat: "yy.mm.dd",
			buttonImage: "../../resources/images/icon_calendar.png",
			buttonText: "날짜 선택",
			buttonImageOnly: true,
			closeText: '닫기',
			currentText: '오늘',
			monthNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
			monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
			dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			dateFormat: 'yy-mm-dd',
			beforeShow: function(input) {
				$("#ui-datepicker-div").css("opacity", "1");
			}
		});
				
		/* multi datepicker (https://xdsoft.net/jqplugins/datetimepicker/) */
		$.datetimepicker.setLocale('ko');
		$('.datebox input.multi-datepicker').datetimepicker({
			format: 'Y-m-d H:i'		
		});

		if(me.mobile.matches){
			isMobile = true;
		}else if(me.tablet.matches){
			isMobile = true;
		}else{
			isMobile = false;
		}
	});

	$(window).resize(function(){
		me.modalResize();
		if(me.desk.matches){
			isMobile = false;
		} else {
			isMobile = true;
		}
		console.log(isMobile);
	});

	$(window).scroll(function(){
	});
}

frontUI.prototype = {
	firstLoad: function(){
		setTimeout(function(){
			$("#wrap").animate({opacity:1});
		}, 300)
	},
	loadingData: function(){
		$("body").append($("<div class='loaderbox'><p class='loader'>로딩중</p></div>"));
		setTimeout(function(){
			$(".loaderbox").hide();
		}, 3000);
	},
	lnbToggle(){
		var sectionEl = $(".section-wrap");
		var btnEl = $(".btn-lnb-toggle");

		if(!sectionEl.is(".lnbClose")){
			sectionEl.addClass("lnbClose");
			btnEl.text("열림").attr("title", "메뉴 열림");
		}else{
			sectionEl.removeClass("lnbClose");
			btnEl.text("닫힘").attr("title", "메뉴 닫힘");
		}	
	},
	lnbMenuActive(Idx){
		var activeMenu = $(".fixed-menu > ul > li:eq("+Idx+")");
		var activeSubmenu = $(".lnb-submenu > ul > li:eq("+Idx+")");

		if(!activeMenu.is(".on")) {
			$(".fixed-menu > ul > li").removeClass("on");
			$(".lnb-submenu > ul > li").removeClass("on");
			activeMenu.addClass("on");
			activeSubmenu.addClass("on");
		}else{
			activeMenu.removeClass("on");
			activeSubmenu.removeClass("on");
		}
	},
	searchToggle(){
		if ($(".search-pannel").is(".toggle-close")){
			$(".search-pannel").removeClass("toggle-close").addClass("toggle-open");
			$(".search-pannel .btn-search-toggle em").text("접기");
		}else{
			$(".search-pannel").removeClass("toggle-open").addClass("toggle-close");
			$(".search-pannel .btn-search-toggle em").text("상세조회");
		}
	},
	modalView: function(modalName, parentModal) {
		var me = this;
		var modalEl = $("."+modalName);
		var parentModal;
		var transparentLayer, transparentLayer2;		

		if(!parentModal){
			$("html, body").animate({scrollTop:0}, 500);

			$(".modalpop").addClass("active");
			$(".modalpop").find(".popupwrap.active").removeClass("active");
			$("body").css("height", modalEl.height()+"px");
			$("#wrap").css("height", modalEl.height()+"px").css("overflow", "hidden");
			modalEl.addClass("active");
			
			if($("body > .pop-transparents-layer").length == 0) {
				$("body").append("<div class='pop-transparents-layer'></div>");
			}
			transparentLayer = $("body > .pop-transparents-layer");
		}else{			
			parentModal = $("."+parentModal);
			parentModal.find(modalEl).addClass("active").css("z-index", "111");
			parentModal.append("<div class='pop-transparents-layer'></div>");
			transparentLayer2 = parentModal.children(".pop-transparents-layer");
		}
		$(document).on("keydown", function(e){
			if ( e.keyCode == 27 || e.which == 27 ) { //esc
				modalEl.find('.btn-popclose').trigger('click');
			}
		});
	},
	modalHide: function(modalName, parentModal, parentCloseYN) {
		var me = this;
		var modalEl = $("."+modalName);
		var parentModal;

		if(!parentModal){
			$("body > .pop-transparents-layer").remove();
			modalEl.find(".popupwrap").removeClass("active");
			$(".modalpop").removeClass("active");
		}else{
			parentModal = $("."+parentModal);
			if (parentCloseYN === true){
				parentModal.css({visibility:"hidden", opacity:"0", left:"-99999px", top:"-99999px"})
				parentModal.find(modalEl).removeClass("active");
				parentModal.children(".pop-transparents-layer").remove();
				$("body > .pop-transparents-layer").remove();
			}
			parentModal.find(modalEl).removeClass("active");
			parentModal.children(".pop-transparents-layer").remove();
		}
	},
	modalResize: function(){
		var me = this;
		var modalEl = $(".modalpop.active");
		var modalHeight = modalEl.children(".popupwrap").innerHeight();
		if(modalHeight > window.innerHeight){
			modalEl.css({alignItems:"flex-start"});
		}else {
			modalEl.css({alignItems:"center"});
		}
	},
	
	modalAlert: function(msg, otherType) {
		var marginTop = ($(window).height() - $('.popupwrap.pop-alert').innerHeight()) / 2;

		if(otherType) {
			if ($('.popupwrap.active').length > 0){
				$('.popupwrap.pop-alert.'+otherType).addClass('active').css("margin-top", marginTop+"px");
				$('.popupwrap.pop-alert.'+otherType+' .alert-msg p').text(msg);
				$('.popupwrap.pop-alert.'+otherType).siblings(".active").find(".pop-contents").append("<div class='pop-transparents-layer'></div>");
			}else{
				setTimeout(function(){
					$("body").append("<div class='pop-transparents-layer' style='background:rgba(0,0,0,0.4);'></div>");
					$('.popupwrap.pop-alert.'+otherType).parent(".modalpop").addClass('active');
					$('.popupwrap.pop-alert.'+otherType).addClass('active').css("margin-top", marginTop+"px");
					$('.popupwrap.pop-alert.'+otherType+' .alert-msg p').text(msg);
				}, 200);
			}
		}else{
			if ($('.popupwrap.active').length > 0){
				$('.popupwrap.pop-alert').addClass('active').css("margin-top", marginTop+"px");
				$('.popupwrap.pop-alert .alert-msg p').text(msg);
				$('.popupwrap.pop-alert').siblings(".active").find(".pop-contents").append("<div class='pop-transparents-layer'></div>");
			}else{
				setTimeout(function(){
					$("body").append("<div class='pop-transparents-layer' style='background:rgba(0,0,0,0.4);'></div>");
					$('.popupwrap.pop-alert').parent(".modalpop").addClass('active');
					$('.popupwrap.pop-alert').addClass('active').css("margin-top", marginTop+"px");
					$('.popupwrap.pop-alert .alert-msg p').text(msg);
				}, 200);
			}
		}
	},
	modalAlertHide: function(modalName, parentModal) {
		if(parentModal) {
			$('.popupwrap.'+modalName).removeClass('active');
			setTimeout(function () {
				$(".popupwrap .pop-transparents-layer").remove();
				$('.popupwrap.'+parentModal).removeClass('active');
				$('.modalpop').removeClass('active');
				$("body > .pop-transparents-layer").remove();
				window.location.reload();
			}, 500);
		}else{
			$('.popupwrap.'+modalName).removeClass('active');
			setTimeout(function () {
				$(".popupwrap .pop-transparents-layer").remove();
			}, 500);
		}
	},
	tabView: function (tabName) {
		$(".tabbox li").removeClass("on");
		$(".tabbox li."+tabName).addClass("on");
		$(".tab-hiddencontents").removeClass("on");
		$(".tab-hiddencontents."+tabName).addClass("on");
	},
}

var front = new frontUI ();

