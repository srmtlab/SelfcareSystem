$(function(){
	
	
	
	//#####################################################
	//テスト（お遊び） ####################################
	//#####################################################
	
	//ログイン・新規登録ボタンで反応
	$(".login_btn").on("click", function(){
		var id = $("#id_field").val();
		var pass = $("#pass_field").val();
		
		if(id == "shimizu" && pass == "sy0927"){
			alert("記録画面へ??");
			$("#id_field").val("");
			$("#pass_field").val("");
		}else{
			alert("IDかパスワードが間違っています。");
			$("#pass_field").val("");
		}
	});
	
	
	$(".new_login_btn").on("click", function(){
		alert("新規ユーザ登録画面へ");
		$("#id_field").val("");
		$("#pass_field").val("");
	});
	
	//戻る・進むボタンで進行度が変化
	$(".back").on("click", function(){
		if($(".back").hasClass("is-disabled") == false){
			if($(".prog").val() > 0){
				if($(".prog").val() == 100){
					$(".forward").removeClass("is-disabled");
				}
				$(".prog").val($(".prog").val() - 10);
				if($(".prog").val() == 0){
					$(".back").addClass("is-disabled");
				}
			}
		}
	});
	$(".forward").on("click", function(){
		if($(".forward").hasClass("is-disabled") == false){
			if($(".prog").val() < $(".prog").attr("max")){
				if($(".prog").val() == 0){
					$(".back").removeClass("is-disabled");
				}
				$(".prog").val($(".prog").val() + 10);
				if($(".prog").val() == 100){
					$(".forward").addClass("is-disabled");
				}
			}
		}
	});
	
	
});