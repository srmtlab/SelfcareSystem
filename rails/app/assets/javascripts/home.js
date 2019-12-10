$(function () {

	//#############################################################################
	//広場画面用js ################################################################
	//#############################################################################

	//########################################################
	//swiper.js 導入
	//########################################################
	let swiper = new Swiper('.swiper-container', {
		pagination: {
			el: '.swiper-pagination',
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		initialSlide: 1,
	});

	//########################################################
	//広場画面動作プログラム
	//########################################################

	//広場画面動作




	//########################################################
	//使用関数
	//########################################################

	//会話文を表示させる & 履歴に会話文を追加




	//#############################################################################
	//テスト（お遊び） ############################################################
	//#############################################################################


	/*
	//image_pathの使い方
	$(".test").attr("src", image_path("imgs/bear/bear1.png"));

	//getJSONの使い方 (public/hoge.json)
	$.getJSON('/test.json', function (data) {
		alert(data[0].test_name);
	});
	*/

	//テストボタンクリックで戻る進むボタンのON/OFF切り替え
	/*
	$(".test_btn").on("click", function () {
		if ($(".test_btn").hasClass("attach_prog_off")) {
			$(".test_btn").removeClass("attach_prog_off");
			$(".test_btn").addClass("attach_prog_on");
			$(".btn_attach_forward").removeClass("is-disabled");
		} else {
			$(".test_btn").removeClass("attach_prog_on");
			$(".test_btn").addClass("attach_prog_off");
			$(".attach_prog").val(0);
			$(".btn_attach_back").addClass("is-disabled");
			$(".btn_attach_forward").addClass("is-disabled");
		}
	});
	*/
	//戻る・進むボタンで進行度が変化
	/*
	$(".btn_attach_back").on("click", function () {
		if ($(".btn_attach_back").hasClass("is-disabled") == false) {
			if ($(".attach_prog").val() > 0) {
				if ($(".attach_prog").val() == 100) {
					$(".btn_attach_forward").removeClass("is-disabled");
				}
				$(".attach_prog").val($(".attach_prog").val() - 10);
				if ($(".attach_prog").val() == 0) {
					$(".btn_attach_back").addClass("is-disabled");
				}
			}
		}
	});
	$(".btn_attach_forward").on("click", function () {
		if ($(".btn_attach_forward").hasClass("is-disabled") == false) {
			if ($(".attach_prog").val() < $(".attach_prog").attr("max")) {
				if ($(".attach_prog").val() == 0) {
					$(".btn_attach_back").removeClass("is-disabled");
				}
				$(".attach_prog").val($(".attach_prog").val() + 10);
				if ($(".attach_prog").val() == 100) {
					$(".btn_attach_forward").addClass("is-disabled");
				}
			}
		}
	});
	*/
});