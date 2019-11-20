$(function(){
	
	
	
	//#####################################################
	//テスト（お遊び） ####################################
	//#####################################################
	
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

////////////////////////////// BotUIによる質問に関するプログラム　/////////////////////////////////////////////////

	var botui = new BotUI('hello');
	var char_name = "タロウ";
	var user_name = "ようた"

	//////////////////// 質問に入る前の会話の流れ　/////////////////////////////////////////////////////////
	botui.message.bot({

		delay: 1000,
		content: 'はじめまして！'
	});
	botui.message.bot({
		delay: 2000,
		content: 'おいらの名前は' + char_name
	});
	botui.message.bot({
		delay: 3000,
		content: 'これから'+　user_name + 'をサポートしていくから仲良くしておくれよ！'
	});
	botui.message.bot({
		delay: 4000,
		content: 'それとおいら、まだあんまり'+ user_name +`のことを知らないんだよな．．`
	});
	botui.message.bot({
		delay: 5500,
		content: `だから、はやく仲良くなれるためにも`+user_name+`にいろいろ質問したいんだよね!`
	}).then(function(){
		botui.action.button ({
			delay: 1000,
			action:[{
				text: 'いいよ！',
				value: 'いいよ'
			}]
		}).then(function(res){
			botui.message.bot({
				delay:1000,
				content:'ありがとう！'
			});
			botui.message.bot({
				delay:2000,
				content:'じゃあ今からいっぱい質問するからできるだけいっぱい答えてね！'
			}).then(input_food_question);
		});
	});
	////////// 質問１　好きな食べ物を入力する　//////////////////////////////////////////////////////////////////

	function input_food_question(){
		botui.message.bot({
			delay:1000,
			content:'君の好きな食べ物を教えて？'
		}).then(function(){
			botui.action.text({
				delay:1000,
				action:{
					placeholder: '入力してね！'
				}
			}).then(function(res){
				botui.message.bot({
					delay:1000,
					content: 'そうなんだ!'
				});
				botui.message.bot({
					delay:2000,
					content: 'たしかに'+res.value+'はおいしいよね！'
				}).then(select_food_everyday);
			});
		});
	}

	///////// 質問２　１で答えた食べ物は毎日食べるかどうかを「はい」or 「いいえ」で選択 //////////////////////////
	
	function select_food_everyday(){
		botui.message.bot({
			delay:1000,
			content: 'じゃあそれは毎日食べたりするのかな？'
		}).then(function(){
			botui.action.button({
				delay: 1000,
				action: [{
					text: 'はい',
					value: true
				},{
					text: 'いいえ',
					value: false
				}]
			}).then(function(res){

				// 「はい」が選択されたら質問５に遷移する
				if(res.value == true){
					botui.message.bot({
						delay: 1000,
						content: user_name+'は本当にそれが大好きなんだね！'
					}).then(select_another_food)
				}

				// 「いいえ」が選択されたら質問３に遷移する
				else{
					select_food_everyweek();
				}
			})
		})
	}
	
	///////// 質問3　1週間に何日それを食べたりするか /////////////////////////////////////////////////////////

	function select_food_everyweek(){
		botui.message.bot({
			delay: 1000,
			content: 'さすがに毎日は食べたりしないんだね'
		})
		botui.message.bot({
			delay: 2000,
			content: 'それなら1週間で何日くらい食べる？'
		}).then(function(){
			botui.action.button({
				delay: 1000,
				action: [{
					text: '1日',
					value: 1
				},{
					text: '2日',
					value: 2
				},{
					text: '3日',
					value: 3
				},{
					text: '4日',
					value: 4
				},{
					text: '5日',
					value: 5
				},{
					text: '6日',
					value: 6
				},{
					text: '食べない',
					value: 0
				}]
			}).then(function(res){

				// 1日～6日を選択したら質問5に遷移する
				if(res.value>0){
					botui.message.bot({
						delay: 1000,
						content: 'なるほどね！'
					})
					botui.message.bot({
						delay: 2000,
						content: 'おいらも好きなものはそれぐらいのペースで食べるかな'
					}).then(select_another_food)
				}

				// 「食べない」を選択したら質問4に遷移する
				else{
					botui.message.bot({
						delay: 1000,
						content: '好きな食べ物はたまに食べるのがいいよね'
					})
				}
			})
		})
	}

	///////// 質問4　1か月に何日食べるか? ////////////////////////////////////////////////////////////////////

	function select_food_everymonth(){
		botui.message.bot({
			delay: 1000,
			content: 'じゃあ1か月に何日くらい食べたりする？'
		}).then(function(){
			botui.action.button({
				delay: 1000,
				action:[{
					text: '1日',
					value: 1
				},{
					text: '2日',
					value: 2
				},{
					text: '3日',
					value: 3
				},{
					text: '4日',
					value: 4
				},{
					text: '5日',
					value: 5
				},{
					text: '6日',
					value: 6
				},{
					text: '食べない',
					value: 0
				}]
			}).then(function(res){

				// 「はい」，「いいえ」どちらでも質問5に遷移する
				if(res.value>0){
					botui.message.bot({
						delay: 1000,
						content: 'そのくらいの頻度が特別な感じがしていいよね！'
					}).then(select_another_food)
				}
				else{
					botui.message.bot({
						delay: 1000,
						content: 'なかなか食べれないからこそ食べたときにうまいってなるよね！'
					}).then(select_another_food)
				}
			})
		})
	}

	///////// 質問5　ほかに好きな食べ物やよく食べる物はないかどうかを聞く //////////////////////////////////////

	function select_another_food(){
		botui.message.bot({
			delay: 1000,
			content: '他にも好きな食べ物やよく食べる物はある？'
		}).then(function(){
			botui.action.button({
				delay: 1000,
				action: [{
					text: 'はい',
					value: true
				},{
					text: 'いいえ',
					value: false
				}]
			}).then(function(res){
　　　　　　　　　
				// 「はい」が選択されたら質問1に戻る
				if(res.value == true){
					botui.message.bot({
						delay: 1000,
						content: 'ホント！'
					})
					botui.message.bot({
						delay: 2000,
						content: 'それならもう一回質問するね'
					}).then(input_food_question)
				}

				// 「いいえ」が選択されたら食事に関する質問は終わりにする
				else{
					food_question_end();
				}
			})
		})
	}
　　
	/////////////////// 質問終了の部分 ///////////////////////////////////////////////////////////////////////

	function food_question_end(){
		botui.message.bot({
			delay: 1000,
			content: 'じゃあ食べ物に関しての質問は終わりにするね'
		})
		botui.message.bot({
			delay: 2000,
			content: 'いっぱい質問に答えてくれてありがとね'
		})
	}
});
