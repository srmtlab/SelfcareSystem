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

	var botui = new BotUI('hello-world');
	var char_name = "タロウ";
	var user_name = "ようた"
	var question_count = 1;
   
	var period = 1;
	var category_box =['false','false','false','false'];

	var food_index_name =" ";
	var food_index_period;
	var food_index_count = 1;
	var food_index_importance = 1;

	var hobby_index_name =" ";
	var hobby_index_period;
	var hobby_index_count = 1;
	var hobby_index_importance = 1;
	
	var before_sleep_index_name=" ";
	var before_sleep_index_period;
	var before_sleep_index_count = 1;
	var before_sleep_index_importance = 1;

	var index_category=['食事','趣味','睡眠前','人付き合い'];
	var wd_food = "wd:Q2095";
	var wd_action = "wd:Q4026292"
	var wd_location = "wd:Q2221906"
	var s = 0;
    
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
				content:'それじゃあ'+user_name+'が興味ある質問のカテゴリーを次から選んでね'
			}).then(select_index_category)			
		});
	});

	///////// 質問のカテゴリーを選択する //////////////////////////////////////////////////////
	function select_index_category(){
		
			botui.action.button({
				delay: 1000,
				action: [{
					text: index_category[0],
					value: 0
				},{
					text: index_category[1],
					value: 1
				},{
					text: index_category[2],
					value: 2
				},{
					text: index_category[3],
					value: 3
				}]
			}).then(function(res){
				index_category[res.value] = '';
				if(res.value==0){
					question_count=0
					botui.message.bot({
						delay: 1000,
						content: 'じゃあそれについてのことを今から質問するね！'
					}).then(input_food_question)
				}
				if(res.value==1){
					question_count=0
					botui.message.bot({
						delay: 1000,
						content: 'じゃあそれについてのことを今から質問するね！'
					}).then(select_exit_hobby)
				}
				if(res.value==2){
					question_count=0
					botui.message.bot({
						delay: 1000,
						content: 'じゃあそれについてのことを今から質問するね！'
					}).then(start_before_sleep_question)

				}
				if(res.value==3){
					question_count=0
					botui.message.bot({
						delay: 1000,
						content: 'じゃあそれについてのことを今から質問するね！'
					}).then()
				}
			})	
	}

//////////////////　食事に関する質問　　///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
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
				food_index_name = res.value;
				
				botui.message.bot({
					loading: true
				}).then(function(index){
					msgIndex = index;
				});
				search_word(res.value,wd_food,success_food_word,failed_food_word,add_cache,select_food_everyday);
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
					food_index_period = '毎日'
					period = 1;
					botui.message.bot({
						delay: 1000,
						content: user_name+'は本当にそれが大好きなんだね！'
					}).then(select_food_importance)
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
                food_index_count = res.value;
				// 1日～6日を選択したら質問5に遷移する
				if(res.value>0){
					food_index_period = '1週間';
					period = 7;
					botui.message.bot({
						delay: 1000,
						content: 'なるほどね！'
					})
					botui.message.bot({
						delay: 2000,
						content: 'おいらも好きなものはそれぐらいのペースで食べるかな'
					}).then(select_food_importance)
				}

				// 「食べない」を選択したら質問4に遷移する
				else{
					botui.message.bot({
						delay: 1000,
						content: '好きな食べ物はたまに食べるのがいいよね'
					}).then(select_food_everymonth)
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
				food_index_count = res.value;
				// 「はい」，「いいえ」どちらでも質問5に遷移する
				if(res.value>0){
					food_index_period = '1か月';
					period = 30;
					botui.message.bot({
						delay: 1000,
						content: 'そのくらいの頻度が特別な感じがしていいよね！'
					}).then(select_food_importance)
				}
				else{
					food_index_period = 'たまに';
					food_index_count = 1;
					period = 180;
					botui.message.bot({
						delay: 1000,
						content: 'なかなか食べれないからこそ食べたときにうまいってなるよね！'
					}).then(select_food_importance)
				}
			})
		})
	}
    /////////  ルーティンの重要度を決定する
	function select_food_importance(){
		
		botui.message.bot({
			delay: 1000,
			content: '質問に答えてくれてありがとう'
		})
		if(food_index_count>0){
			botui.message.bot({
				delay: 2000,
				content: '質問から'+user_name+'は'+food_index_period+'に'+food_index_count+'回'+food_index_name+'を食べることが分かったよ！'
			})
		}
		if(food_index_count==0){
			botui.message.bot({
				delay: 2000,
				content: '質問から'+user_name+'は'+food_index_period+food_index_name+'を食べることが分かったよ！'
			})
		}
		botui.message.bot({
			delay: 3000,
			content: 'じゃあそれは'+user_name+'にとってどのくらい重要なのか1～5段階で教えてほしい'
		})
		botui.action.button({
			delay: 4000,
			action: [{
				text: '1',
				value: 1
			},{
				text: '2',
				value: 2
			},{
				text: '3',
				value: 3
			},{
				text: '4',
				value: 4
			},{
				text: '5',
				value: 5
			}]
		}).then(function(res){
			food_index_importance = res.value
			if(res.value == 1 || res.value == 2){
				botui.message.bot({
					delay: 1000,
					content: user_name+'にとってはあんまり重要なことじゃないんだ'
				})
			}
			if(res.value == 3 || res.value == 4){
				botui.message.bot({
					delay: 1000,
					content: user_name+'にとってはまあまあ重要なことなんだ'
				})
			}
			if(res.value == 5){
				botui.message.bot({
					delay: 1000,
					content: user_name+'にとってはかなり重要なことなんだね！'
				})
			}
		}).then(select_food_type)
	}


	function select_food_type(){
		if(food_index_count>0){
			botui.message.bot({
				delay: 1000,
				content: 'それじゃあ最後に'+user_name+'にとって、'+food_index_period+'に'+food_index_count+'回'+food_index_name+'を食べることは次のどれに分類されるかおしえてほしいな'
			})
		}
		if(food_index_count==0){
			botui.message.bot({
				delay: 1000,
				content: 'それじゃあ最後に'+user_name+'にとって、'+food_index_period+food_index_name+'を食べることは次のどれに関係しているかおしえてほしいな'
			})
		}
		botui.message.bot({
			delay: 2500,
			content: 'もし1つに絞れない時は複数選択して大丈夫だよ！'
		})
		botui.action.select({
			delay: 3500,
			action: {
				placeholder : "選択してね", 
				value :'', // Selected value or selected object. Example: {value: "TR", text : "Türkçe" }
				searchselect : true, // Default: true, false for standart dropdown
				label : 'text', // dropdown label variable
				multipleselect : true, // Default: false
				options : [
								{value: "health", text : "身体に関すること" },
								{value: "mind", text : "心に関すること" },
								{value: "sociality", text : "人付き合いに関すること" },
								{value: "communication", text : "コミュニケーションに関すること" },
						  ],
				button: {
				  icon: '',
				  label: 'OK'
				}
			}
		 }).then(function(res){
			var category = res.value.split(',');

			category_organize(category,category_box);

			console.log(category_box)
			add_routines(food_index_name,period,food_index_count,food_index_importance,category_box);
			botui.message.bot({
				delay: 1000,
				content: 'なるほどね！'
			})
			botui.message.bot({
				delay: 3000,
				content: user_name+'にとっては'+res.text+'に関係しているんだね！'
			})
		 }).then(select_another_food)
	}

	///////// 質問5　ほかに好きな食べ物やよく食べる物はないかどうかを聞く //////////////////////////////////////

	function select_another_food(){
		if(question_count>3){
			food_question_end();
		}
		else{
			botui.message.bot({
				delay: 3000,
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
						question_count++;
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
		botui.message.bot({
			delay: 3000,
			content: 'それじゃあ次の質問のカテゴリーを選んでね！'
		}).then(select_index_category);
	}
/////////////　　趣味に関する質問　　///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function select_exit_hobby(){
		botui.message.bot({
			delay: 1000,
			content: user_name+'は何か趣味があったりするかな？'
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
				if(res.value==true){
					input_hobby_question();
				}	
				else{
					input_freetime_question();
				}
	    	})
		})
	}
	
	function input_hobby_question(){
		botui.message.bot({
			delay: 1000,
			content: 'そうなんだ！'
		})
		botui.message.bot({
			delay: 2000,
			content: 'じゃあその趣味が何か教えてほしいな'
		}).then(function(){
			botui.action.text({
				delay:1000,
				action:{
					placeholder: '入力してね！'
				}
			}).then(function(res){
				hobby_index_name = res.value;
				botui.message.bot({
					loading: true
				}).then(function(index){
					msgIndex = index;
				});
				search_word(res.value,wd_action,success_food_word,failed_food_word,add_cache,select_hobby_everyday);
			});
		});
	}
	
	function input_freetime_question(){
		botui.message.bot({
			delay: 1000,
			content: 'そうなんだ！'
		})
		botui.message.bot({
			delay: 2000,
			content: 'いきなり趣味を聞かれても答えにくかったよね'
		})
		botui.message.bot({
			delay: 3000,
			content: 'それなら暇なときによくすることを教えてくれないかな？'
		}).then(function(){
			botui.action.text({
				delay:1000,
				action:{
					placeholder: '入力してね！'
				}
			}).then(function(res){
				hobby_index_name = res.value;
				botui.message.bot({
					loading: true
				}).then(function(index){
					msgIndex = index;
				});
				search_word(res.value,wd_action,success_food_word,failed_food_word,add_cache,select_hobby_everyday);
			});
		});
	}


	function select_hobby_everyday(){
		botui.message.bot({
			delay:1000,
			content: 'じゃあそれは毎日するのかな？'
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
					hobby_index_period = '毎日'
					period = 1;
					botui.message.bot({
						delay: 1000,
						content: user_name+'は本当にそれが大好きなんだね！'
					}).then(select_hobby_importance)
				}

				// 「いいえ」が選択されたら質問３に遷移する
				else{
					select_hobby_everyweek();
				}
			})
		})
	}

	function select_hobby_everyweek(){
		botui.message.bot({
			delay: 1000,
			content: 'さすがに毎日はしたりしないんだね'
		})
		botui.message.bot({
			delay: 2000,
			content: 'それなら1週間で何日くらいする？'
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
					text: 'しない',
					value: 0
				}]
			}).then(function(res){
                hobby_index_count = res.value;
				// 1日～6日を選択したら質問5に遷移する
				if(res.value>0){
					hobby_index_period = '1週間';
					period = 7;
					botui.message.bot({
						delay: 1000,
						content: 'なるほどね！'
					})
					botui.message.bot({
						delay: 2000,
						content: 'おいらも毎日はできないけど，そのくらいはするかな'
					}).then(select_hobby_importance)
				}

				// 「食べない」を選択したら質問4に遷移する
				else{
					botui.message.bot({
						delay: 1000,
						content: '意外と時間なくてできないときがあるよね'
					}).then(select_hobby_everymonth)
				}
			})
		})
	}

	function select_hobby_everymonth(){
		botui.message.bot({
			delay: 1000,
			content: 'じゃあ1か月にどのくらいする？'
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
					text: 'しない',
					value: 0
				}]
			}).then(function(res){
				hobby_index_count = res.value;
				// 「はい」，「いいえ」どちらでも質問5に遷移する
				if(res.value>0){
					hobby_index_period = '1か月';
					period = 30;
					botui.message.bot({
						delay: 1000,
						content: 'そのくらいの頻度が特別な感じがしていいよね！'
					}).then(select_hobby_importance)
				}
				else{
					hobby_index_period = 'たまに';
					hobby_index_count = 1;
					period = 180;
					botui.message.bot({
						delay: 1000,
						content: 'なかなか趣味にかけれる時間ってないんだよね'
					}).then(select_hobby_importance)
				}
			})
		})
	}

	function select_hobby_importance(){
		botui.message.bot({
			delay: 1000,
			content: '質問に答えてくれてありがとう'
		})
		if(hobby_index_count>0){
			botui.message.bot({
				delay: 2000,
				content: '質問から'+user_name+'は'+hobby_index_period+'に'+hobby_index_count+'回'+hobby_index_name+'ことが分かったよ！'
			})
		}
		if(hobby_index_count==0){
			botui.message.bot({
				delay: 2000,
				content: '質問から'+user_name+'は'+hobby_index_period+hobby_index_name+'ことが分かったよ！'
			})
		}
		botui.message.bot({
			delay: 3000,
			content: 'じゃあそれは'+user_name+'にとってどのくらい重要なのか1～5段階で教えてほしい'
		})
		botui.action.button({
			delay: 4000,
			action: [{
				text: '1',
				value: 1
			},{
				text: '2',
				value: 2
			},{
				text: '3',
				value: 3
			},{
				text: '4',
				value: 4
			},{
				text: '5',
				value: 5
			}]
		}).then(function(res){
			hobby_index_importance = res.value
			if(res.value == 1 || res.value == 2){
				botui.message.bot({
					delay: 1000,
					content: user_name+'にとってはあんまり重要なことじゃないんだ'
				})
			}
			if(res.value == 3 || res.value == 4){
				botui.message.bot({
					delay: 1000,
					content: user_name+'にとってはまあまあ重要なことなんだ'
				})
			}
			if(res.value == 5){
				botui.message.bot({
					delay: 1000,
					content: user_name+'にとってはかなり重要なことなんだね！'
				})
			}
		}).then(select_hobby_type)
	}
	
	function select_hobby_type(){
		if(hobby_index_count>0){
			botui.message.bot({
				delay: 1000,
				content: 'それじゃあ最後に'+user_name+'にとって、'+hobby_index_period+'に'+hobby_index_count+'回'+hobby_index_name+'ことは次のどれに分類されるかおしえてほしいな'
			})
		}
		if(hobby_index_count==0){
			botui.message.bot({
				delay: 1000,
				content: 'それじゃあ最後に'+user_name+'にとって、'+hobby_index_period+hobby_index_name+'ことは次のどれに関係しているかおしえてほしいな'
			})
		}
		botui.message.bot({
			delay: 2500,
			content: 'もし1つに絞れない時は複数選択して大丈夫だよ！'
		})
		botui.action.select({
			delay: 3500,
			action: {
				placeholder : "選択してね", 
				value :'', // Selected value or selected object. Example: {value: "TR", text : "Türkçe" }
				searchselect : true, // Default: true, false for standart dropdown
				label : 'text', // dropdown label variable
				multipleselect : true, // Default: false
				options : [
								{value: "health", text : "身体に関すること" },
								{value: "mind", text : "心に関すること" },
								{value: "sociality", text : "人付き合いに関すること" },
								{value: "communication", text : "コミュニケーションに関すること" },
						  ],
				button: {
				  icon: '',
				  label: 'OK'
				}
			}
		 }).then(function(res){
			var category = res.value.split(',');

			category_organize(category,category_box);

			console.log(category_box)
			add_routines(hobby_index_name,period,hobby_index_count,hobby_index_importance,category_box);
			botui.message.bot({
				delay: 1000,
				content: 'なるほどね！'
			})
			botui.message.bot({
				delay: 3000,
				content: user_name+'にとっては'+res.text+'に関係しているんだね！'
			})
		 }).then(select_another_hobby)
	}


    function select_another_hobby(){
		if(question_count>3){
			hobby_question_end();
		}
		else{
			botui.message.bot({
				delay: 3000,
				content: '他にも趣味はある？'
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
						question_count++;
						botui.message.bot({
							delay: 1000,
							content: 'ホント！'
						})
						botui.message.bot({
							delay: 2000,
							content: 'それならもう一回質問するね'
						}).then(select_exit_hobby)
					}
	
					// 「いいえ」が選択されたら食事に関する質問は終わりにする
					else{
						hobby_question_end();
					}
				})
			})
		}	
	}

	function hobby_question_end(){
		botui.message.bot({
			delay: 1000,
			content: 'じゃあ趣味に関しての質問は終わりにするね'
		})
		botui.message.bot({
			delay: 2000,
			content: 'いっぱい質問に答えてくれてありがとね'
		})
		botui.message.bot({
			delay: 3000,
			content: 'それじゃあ次の質問のカテゴリーを選んでね！'
		}).then(select_index_category);
	}
////////////////////////////    趣味の質問終了  ///////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////    睡眠前の質問開始   ////////////////////////////////////////////////////////////////////////////////////////

    function start_before_sleep_question(){
		botui.message.bot({
			delay: 1000,
			content: 'おいらは寝る前って結構いろんなことしたりするんだ'
		})
		botui.message.bot({
			delay: 2000,
			content: user_name+'は寝る前に何かすることってある？'
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
				if(res.value==true){
					botui.message.bot({
						delay: 1000,
						content: 'そうなんだ！'
					}).then(input_before_sleep_question)
				}	
				else{
					before_sleep_question_end();
				}
	    	})
		})
	}

	function input_before_sleep_question(){
		botui.message.bot({
			delay: 1000,
			content: 'じゃあ何をするか教えてほしいな'
		}).then(function(){
			botui.action.text({
				delay:1000,
				action:{
					placeholder: '入力してね！'
				}
			}).then(function(res){
				before_sleep_index_name = res.value;
				botui.message.bot({
					loading: true
				}).then(function(index){
					msgIndex = index;
				});
				search_word(res.value,wd_action,success_food_word,failed_food_word,add_cache,select_before_sleep_everyday);
			});
		});
	}

	function select_before_sleep_everyday(){
		botui.message.bot({
			delay:1000,
			content: 'じゃあそれは毎日するのかな？'
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
					before_sleep_index_period = '毎日'
					period = 1;
					botui.message.bot({
						delay: 1000,
						content: user_name+'は本当にそれが大好きなんだね！'
					}).then(select_before_sleep_importance)
				}

				// 「いいえ」が選択されたら質問３に遷移する
				else{
					select_before_sleep_everyweek();
				}
			})
		})
	}

	function select_before_sleep_everyweek(){
		botui.message.bot({
			delay: 1000,
			content: 'さすがに毎日はしたりしないんだね'
		})
		botui.message.bot({
			delay: 2000,
			content: 'それなら1週間で何日くらいする？'
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
					text: 'しない',
					value: 0
				}]
			}).then(function(res){
                before_sleep_index_count = res.value;
				// 1日～6日を選択したら質問5に遷移する
				if(res.value>0){
					before_sleep_index_period = '1週間';
					period = 7;
					botui.message.bot({
						delay: 1000,
						content: 'なるほどね！'
					})
					botui.message.bot({
						delay: 2000,
						content: 'おいらも毎日はできないけど，そのくらいはするかな'
					}).then(select_before_sleep_importance)
				}

				// 「食べない」を選択したら質問4に遷移する
				else{
					botui.message.bot({
						delay: 1000,
						content: '意外と時間なくてできないときがあるよね'
					}).then(select_before_sleep_everymonth)
				}
			})
		})
	}

	function select_before_sleep_everymonth(){
		botui.message.bot({
			delay: 1000,
			content: 'じゃあ1か月にどのくらいする？'
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
					text: 'しない',
					value: 0
				}]
			}).then(function(res){
				before_sleep_index_count = res.value;
				// 「はい」，「いいえ」どちらでも質問5に遷移する
				if(res.value>0){
					before_sleep_index_period = '1か月';
					period = 30;
					botui.message.bot({
						delay: 1000,
						content: 'そのくらいの頻度が特別な感じがしていいよね！'
					}).then(select_before_sleep_importance)
				}
				else{
					before_sleep_index_period = 'たまに';
					before_sleep_index_count = 1;
					period = 180;
					botui.message.bot({
						delay: 1000,
						content: 'なかなか趣味にかけれる時間ってないんだよね'
					}).then(select_before_sleep_importance)
				}
			})
		})
	}

	function select_before_sleep_importance(){
		botui.message.bot({
			delay: 1000,
			content: '質問に答えてくれてありがとう'
		})
		if(before_sleep_index_count>0){
			botui.message.bot({
				delay: 2000,
				content: '質問から'+user_name+'は'+before_sleep_index_period+'に'+before_sleep_index_count+'回'+before_sleep_index_name+'ことが分かったよ！'
			})
		}
		if(before_sleep_index_count==0){
			botui.message.bot({
				delay: 2000,
				content: '質問から'+user_name+'は'+before_sleep_index_period+before_sleep_index_name+'ことが分かったよ！'
			})
		}
		botui.message.bot({
			delay: 3000,
			content: 'じゃあそれは'+user_name+'にとってどのくらい重要なのか1～5段階で教えてほしい'
		})
		botui.action.button({
			delay: 4000,
			action: [{
				text: '1',
				value: 1
			},{
				text: '2',
				value: 2
			},{
				text: '3',
				value: 3
			},{
				text: '4',
				value: 4
			},{
				text: '5',
				value: 5
			}]
		}).then(function(res){
			before_sleep_index_importance = res.value
			if(res.value == 1 || res.value == 2){
				botui.message.bot({
					delay: 1000,
					content: user_name+'にとってはあんまり重要なことじゃないんだ'
				})
			}
			if(res.value == 3 || res.value == 4){
				botui.message.bot({
					delay: 1000,
					content: user_name+'にとってはまあまあ重要なことなんだ'
				})
			}
			if(res.value == 5){
				botui.message.bot({
					delay: 1000,
					content: user_name+'にとってはかなり重要なことなんだね！'
				})
			}
		}).then(select_before_sleep_type)
	}

	function select_before_sleep_type(){
		if(before_sleep_index_count>0){
			botui.message.bot({
				delay: 1000,
				content: 'それじゃあ最後に'+user_name+'にとって、'+before_sleep_index_period+'に'+before_sleep_index_count+'回'+before_sleep_index_name+'ことは次のどれに分類されるかおしえてほしいな'
			})
		}
		if(hobby_index_count==0){
			botui.message.bot({
				delay: 1000,
				content: 'それじゃあ最後に'+user_name+'にとって、'+before_sleep_index_period + before_sleep_index_name+'ことは次のどれに関係しているかおしえてほしいな'
			})
		}
		botui.message.bot({
			delay: 2500,
			content: 'もし1つに絞れない時は複数選択して大丈夫だよ！'
		})
		botui.action.select({
			delay: 3500,
			action: {
				placeholder : "選択してね", 
				value :'', // Selected value or selected object. Example: {value: "TR", text : "Türkçe" }
				searchselect : true, // Default: true, false for standart dropdown
				label : 'text', // dropdown label variable
				multipleselect : true, // Default: false
				options : [
								{value: "health", text : "身体に関すること" },
								{value: "mind", text : "心に関すること" },
								{value: "sociality", text : "人付き合いに関すること" },
								{value: "communication", text : "コミュニケーションに関すること" },
						  ],
				button: {
				  icon: '',
				  label: 'OK'
				}
			}
		 }).then(function(res){
			var category = res.value.split(',');

			category_organize(category,category_box);

			console.log(category_box)
			add_routines(before_sleep_index_name,period,before_sleep_index_count,before_sleep_index_importance,category_box);
			botui.message.bot({
				delay: 1000,
				content: 'なるほどね！'
			})
			botui.message.bot({
				delay: 3000,
				content: user_name+'にとっては'+res.text+'に関係しているんだね！'
			})
		 }).then(select_another_before_sleep)
	}

	function select_another_before_sleep(){
		if(question_count>3){
			before_sleep_question_end();
		}
		else{
			botui.message.bot({
				delay: 3000,
				content: '他にも睡眠前にすることはある？'
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
						question_count++;
						botui.message.bot({
							delay: 1000,
							content: 'ホント！'
						}).then(input_before_sleep_question)
					}
	
					// 「いいえ」が選択されたら食事に関する質問は終わりにする
					else{
						before_sleep_question_end();
					}
				})
			})
		}	
	}

	function before_sleep_question_end(){
		botui.message.bot({
			delay: 1000,
			content: 'じゃあ睡眠前に関しての質問は終わりにするね'
		})
		botui.message.bot({
			delay: 2000,
			content: 'それじゃあ次の質問のカテゴリーを選んでね！'
		}).then(select_index_category);
	}
	///////   入力された単語がWikidata内またはキャッシュに存在した場合の処理   ///////////////////////////
	function success_food_word(func){
		botui.message.update(msgIndex,{
			content: 'そうなんだ!'
		}).then(func);
		
	}
	
	///////  Wikidataにもキャッシュにも入力された単語が存在しなかった場合の処理   //////////////////////////
	function failed_food_word(text,func){
		botui.message.update(msgIndex,{
			content: 'それについておいらはよく知らないんだ'
		});
		botui.message.bot({
			delay:2000,
			content: '良かったらそれが何なのか僕に教えてくれないか？'
		}).then(function(){
			botui.action.text({
				delay:1000,
				action:{
					placeholder: '入力してね！'
				}
			}).then(function(res){
				exist_subclass(res.value).success(function(data){
					if(data.results.bindings.length>0){
						var cache_wd = 'wd:'+data.results.bindings[0].a["value"].split('/')[4]
						add_cache(text,cache_wd)
					}
					else{
						add_cache(text,res.value)
					}
				})
			}).then(func)
		})
	}


	/////////   ユーザが入力した単語を判別する(関数)　　//////////////////////////////////////
	function search_word(word,wd,func1,func2,func3,next){
		find_cache(word).success(function(data){
			if(data['label'] == word){
				if(data['wd_type']==wd){
					func1(next);
				}
				else{
					research_subclass(data['wd_type'],wd).success(function(data){
						if(data.results.bindings.length>0){
							func1(next);
						}
						else{
							func2(word,next);
						}
					})
				}
			}
			else{
				search_subclass(word,wd).success(function(data){
					//console.log(data.results.bindings[0].b["value"])
					if(data.results.bindings.length>0){
						func1(next);
						func3(word,wd);
					}
					else{
						search_instanceclass(word,wd).success(function(data){
							if(data.results.bindings.length>0){
								func1(next);
								func3(word,wd);
							}
							else{
								search_include_subclass(word,wd).success(function(data){
									if(data.results.bindings.length>0){
										func1(next);
										func3(word,wd);
									}
									else{
										func2(word,next);
									}
								})
							}
						})
					}
				})
			}
		})
	}
	
	function research_subclass(word,wd){
		const query =`
		PREFIX wd: <http://www.wikidata.org/entity/>
		PREFIX wds: <http://www.wikidata.org/entity/statement/> 
		PREFIX wdt: <http://www.wikidata.org/prop/direct/>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
		SELECT ?b
 		WHERE{
   			`+word+` wdt:P279+ ?b;
   			FILTER(?b = `+wd+`).
		}`

		return $.ajax({
			type: 'GET',
			url: 'https://query.wikidata.org/sparql',
			data: {
				query
			},
			dataType: 'json',
		})
	}
	/////////  入力された単語がWikidata上に存在するか調べる(sparql)　　///////////////////////////
	function exist_subclass(word){
		const query =`
		PREFIX wd: <http://www.wikidata.org/entity/>
		PREFIX wds: <http://www.wikidata.org/entity/statement/> 
		PREFIX wdt: <http://www.wikidata.org/prop/direct/>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
		SELECT ?a
		WHERE{
 			{
 				?a rdfs:label "`+word+`"@ja;
 			}
 			UNION
  			{
  				?a skos:altLabel "`+word+`"@ja;
  			}
		}
		LIMIT 1`
		return $.ajax({
			type: 'GET',
			url: 'https://query.wikidata.org/sparql',
			data: {
				query
			},
			dataType: 'json',
		})
		
	}

    ////////     入力された単語をsubclass ofから調べる(sparql)    ////////////////////////
	function search_subclass(word,wd){
		const query = `PREFIX wd: <http://www.wikidata.org/entity/> 
		PREFIX wds: <http://www.wikidata.org/entity/statement/> 
		PREFIX wdt: <http://www.wikidata.org/prop/direct/>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
		SELECT ?b
		WHERE{
			{
			 ?a rdfs:label "`+word+`"@ja;
				wdt:P279+ ?b.
			 FILTER(?b = `+ wd +`).
			 }
			UNION
			{
			  ?a skos:altLabel "`+ word + `"@ja;
				wdt:P279+ ?b.
			 FILTER(?b = `+ wd + `).
			}
		  }`
		return $.ajax({
			type: 'GET',
			url: 'https://query.wikidata.org/sparql',
			data: {
				query
			},
			dataType: 'json',
		})
	};
	
	//////////   入力された単語をinstance ofからたどって調べる(sparql)    ////////////////////////
	function search_instanceclass(word,wd){
		const query = `PREFIX wd: <http://www.wikidata.org/entity/> 
		PREFIX wds: <http://www.wikidata.org/entity/statement/> 
		PREFIX wdt: <http://www.wikidata.org/prop/direct/>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
		SELECT ?c
		WHERE{
			{
			  ?a rdfs:label "` +word+ `"@ja;
				wdt:P31+ ?b.
			 ?b wdt:P279+ ?c.
			 FILTER(?c =` +wd+ `).
			}
			UNION
			{
			  ?a skos:altLabel "` +word+ `"@ja;
				wdt:P31+ ?b.
			 ?b wdt:P279+ ?c.
			 FILTER(?c =` +wd+ `).
			}
		  }`
		return $.ajax({
			type: 'GET',
			url: 'https://query.wikidata.org/sparql',
			data: {
				query
			},
			dataType: 'json',
		})
	}
	
	////////////   Wikidata内に主辞となる単語が存在するか調べる(sparql)　　////////////////////////
	function search_include_subclass(word,wd){
		const query = `PREFIX wd: <http://www.wikidata.org/entity/> 
		PREFIX wds: <http://www.wikidata.org/entity/statement/> 
		PREFIX wdt: <http://www.wikidata.org/prop/direct/>
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
		SELECT ?b
		WHERE{ 
			?a wdt:P279+`+wd+`;
				  rdfs:label ?b.
			   FILTER(LANG(?b) = 'ja').
				FILTER CONTAINS("`+word+`"@ja,?b).
		} `
		return $.ajax({
			type: 'GET',
			url: 'https://query.wikidata.org/sparql',
			data: {
				query
			},
			dataType: 'json',
		})
	}

	//////////　　入力された単語がキャッシュに存在するか判別(POST)　　///////////////////////
	function find_cache(text){
		return $.ajax({
			url: '/question/register',
			type: 'POST',
			data: {
				'text': text
			}
		})
	}
	
	//////////    キャッシュに追加(POST)　　///////////////////////////////////
	function add_cache(text,wd){
		$.ajax({
			url: '/question/addCache',
			type: 'POST',
			data: {
				'text': text,
				'wd_type': wd
			}
		})
	}

    ////////   ルーティンをデータベースに追加(POST)　　////////////////////////
	function add_routines(text,period,count,importance,category){
		$.ajax({
			url: '/question/addRoutines',
			type: 'POST',
			data: {
				'text': text,
				'period': period,
				'count': count,
				'importance': importance,
				'category': category
			}
		})
	}

	function category_organize(category,category_box){
		for(var i=0; i<category.length; i++){
			if(category[i]=='health'){
				category_box[0]='true'
			}
			else if(category[i]=='mind'){
				category_box[1]='true'
			}
			else if(category[i]=='sociality'){
				category_box[2]='true'
			}
			else if(category[i]=='communication'){
				category_box[3]='true'
			}
		}
	}
});
