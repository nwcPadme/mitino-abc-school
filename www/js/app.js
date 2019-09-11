angular.module("mitino_abc_school", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","mitino_abc_school.controllers", "mitino_abc_school.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Mitino ABC School" ;
		$rootScope.appLogo = "data/images/header/logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_sch = false ;
		$rootScope.hide_menu_pos = false ;
		$rootScope.hide_menu_pay = false ;
		$rootScope.hide_menu_pro = false ;
		$rootScope.hide_menu_games = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "mitino_abc_school",
				storeName : "mitino_abc_school",
				description : "The offline datastore for Mitino ABC School app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("mitino_abc_school.login");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("ru");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("ru");
})



.config(function($stateProvider,$urlRouterProvider,$sceDelegateProvider,$ionicConfigProvider,$httpProvider){
	/** tabs position **/
	$ionicConfigProvider.tabs.position("bottom"); 
	try{
	// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?school\-abc\.ru/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("mitino_abc_school",{
		url: "/mitino_abc_school",
		abstract: true,
		templateUrl: "templates/mitino_abc_school-tabs.html",
	})

	.state("mitino_abc_school.about_us", {
		url: "/about_us",
		views: {
			"mitino_abc_school-about_us" : {
						templateUrl:"templates/mitino_abc_school-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.dashboard", {
		url: "/dashboard",
		views: {
			"mitino_abc_school-dashboard" : {
						templateUrl:"templates/mitino_abc_school-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.games", {
		url: "/games",
		cache:false,
		views: {
			"mitino_abc_school-games" : {
						templateUrl:"templates/mitino_abc_school-games.html",
						controller: "gamesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.login", {
		url: "/login",
		cache:false,
		views: {
			"mitino_abc_school-login" : {
						templateUrl:"templates/mitino_abc_school-login.html",
						controller: "loginCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.menu_one", {
		url: "/menu_one",
		views: {
			"mitino_abc_school-menu_one" : {
						templateUrl:"templates/mitino_abc_school-menu_one.html",
						controller: "menu_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.menu_two", {
		url: "/menu_two",
		views: {
			"mitino_abc_school-menu_two" : {
						templateUrl:"templates/mitino_abc_school-menu_two.html",
						controller: "menu_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.pay", {
		url: "/pay",
		cache:false,
		views: {
			"mitino_abc_school-pay" : {
						templateUrl:"templates/mitino_abc_school-pay.html",
						controller: "payCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.pos", {
		url: "/pos",
		cache:false,
		views: {
			"mitino_abc_school-pos" : {
						templateUrl:"templates/mitino_abc_school-pos.html",
						controller: "posCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.pro", {
		url: "/pro",
		views: {
			"mitino_abc_school-pro" : {
						templateUrl:"templates/mitino_abc_school-pro.html",
						controller: "proCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.prof", {
		url: "/prof",
		cache:false,
		views: {
			"mitino_abc_school-prof" : {
						templateUrl:"templates/mitino_abc_school-prof.html",
						controller: "profCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.sch", {
		url: "/sch",
		cache:false,
		views: {
			"mitino_abc_school-sch" : {
						templateUrl:"templates/mitino_abc_school-sch.html",
						controller: "schCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mitino_abc_school.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"mitino_abc_school-slide_tab_menu" : {
						templateUrl:"templates/mitino_abc_school-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})


// router by user


	$urlRouterProvider.otherwise("/mitino_abc_school/login");
});
