$(function () {

    //##################################################################################################
    //広場画面用js #####################################################################################
    //##################################################################################################

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

    //###############################################################################################
    //広場画面動作プログラム  ########################################################################
    //###############################################################################################

    //広場画面動作
    //######################################
    //広場画面事前準備
    //######################################
    //意見参考機能で参考にした生活指標のインデックス
    var referenced_routine_index = -1;
    //意見参考機能の進行度を示すインデックス
    var i_plaza1 = 1;
    //意見参考機能を利用したかどうかの判定用、いるか微妙なところ
    var plaza_count = 0;
    //ユーザが画面をスライドできないようにする
    //FIXME:普段は動かせるようにしておいて、
    //      意見参考ボタンを押したときに動かせないようにすればいいかな
    //(テンプレート進行のため)
    swiper.allowTouchMove = false;
    //広場画面に表示するエージェントの名前
    avators = [avator1.name, avator2.name, avator3.name];
    //エージェントの見た目
    avator1_imgs = make_char_imgs(avator1, "left");
    avator2_imgs = make_char_imgs(avator2, "center");
    avator3_imgs = make_char_imgs(avator3, "right");
    avators_imgs = [avator1_imgs, avator2_imgs, avator3_imgs];
    $(".char_left").attr("src", image_path(avators_imgs[0][0]));
    $(".char_center").attr("src", image_path(avators_imgs[1][0]));
    $(".char_right").attr("src", image_path(avators_imgs[2][0]));
    //キャラクターの見た目
    $(".fairy").attr("src", image_path("imgs/fairy/fairy_winter1.gif"));
    //表示するルーティーン配列の用意
    // ワースト用:routine1:ワースト1の生活指標、routine2:ワースト1の生活指標、routine3:ワースト2の生活指標
    // ランダム用:routine1:カテゴリー1、routine2:カテゴリー2、routine3:カテゴリー3
    var category_routines = [routine1, routine2, routine3];
    //選択された生活指標のカテゴリー一覧配列
    var categories = [];
    if (selected_root <= 2) {
        categories = [category1, category2, category3];
    } else {
        categories = [category1, category1, category2];
    }
    //ユーザがもつ全ての生活指標を生活指標リスト(MyRoutinesボタン)に追加
    for (var i_c = 0; i_c < user_routines.length; i_c++) {
        var routine_categories = "";
        for (var j = 0; j < user_categories[i_c].length; j++) {
            if (j < user_categories[i_c].length - 1) {
                if (user_categories[i_c][j] == 0) {
                    routine_categories = routine_categories + "身体、";
                } else if (user_categories[i_c][j] == 1) {
                    routine_categories = routine_categories + "感覚、";
                } else if (user_categories[i_c][j] == 2) {
                    routine_categories = routine_categories + "対人関係、";
                } else if (user_categories[i_c][j] == 3) {
                    routine_categories = routine_categories + "学び/精神、";
                }
            } else if (j == user_categories[i_c].length - 1) {
                if (user_categories[i_c][j] == 0) {
                    routine_categories = routine_categories + "身体";
                } else if (user_categories[i_c][j] == 1) {
                    routine_categories = routine_categories + "感覚";
                } else if (user_categories[i_c][j] == 2) {
                    routine_categories = routine_categories + "対人関係";
                } else if (user_categories[i_c][j] == 3) {
                    routine_categories = routine_categories + "学び/精神";
                }
            }
        }
        $(".routines_list").append("<p class=\"routines_text\">" + user_routines[i_c].text + "<br>(<span class=\"routines_routine\">" + routine_categories + "</span>)</p>");
    }

    //######################################
    //広場画面案内 
    //######################################
    //始めるボタンを押して広場画面を開始
    $(".btn_history_start").on("click", function () {
        $(".btn_next").prop("disabled", true);
        $(".talk_history").fadeOut(500, function () {
            $(".talk_history").css("visibility", "hidden");
            $(".talk_history").css("display", "block");
            $(".talk_history_list").html("");
            $(".btn_history_close").css("display", "inline-block");
            $(".btn_history_start").css("visibility", "hidden");
            //広場画面開始
            $(".plaza").removeClass("answer-off");
            $(".plaza").addClass("test2-on");
            $(".btn_history").css("width", "98px");
            $(".talk").fadeIn(500, function () {
                $(".talker").attr("src", image_path("imgs/fairy/fairy_winter1.png"));
                data_start = { "who": -1, "talk": "生活指標入力は入力ボタン、<br>戻る場合は記録画面ボタン<br>を押してね。" };
                display_talk(data_start, current_user.name, 0, categories, avators);
            });
            //各種ボタンを表示
            $(".btn_enter").fadeIn(500);
            $(".btn_plaza").fadeIn(500);
            $(".btn_record").fadeIn(500);
            $(".btn_history").fadeIn(500);
            $(".btn_routines").fadeIn(500);
            $(".btn_help").fadeIn(500);
        });
    });

    //######################################
    //履歴画面を開く、閉じる
    //######################################
    $(".btn_history").on("click", function () {
        $(".talk_history").css("visibility", "visible");
    });
    $(".btn_history_close").on("click", function () {
        $(".talk_history").css("visibility", "hidden");
    });
    //######################################
    //MyRoutine画面を開く、閉じる
    //######################################
    $(".btn_routines").on("click", function () {
        $(".test_user_routines").css("visibility", "visible");
    });
    $(".btn_routines_close").on("click", function () {
        $(".test_user_routines").css("visibility", "hidden");
    });
    //######################################
    //ヘルプ画面を開く、閉じる
    //######################################
    $(".btn_help").on("click", function () {
        $(".test_help").css("visibility", "visible");
    });
    $(".btn_help_close").on("click", function () {
        $(".test_help").css("visibility", "hidden");
    });

    //######################################
    //入力フォームで指標頻度が決まったときに指標回数をselectに追加する
    //(日/週/月/年が入力されると、回数を表示するボックスに1~100が追加される)
    //######################################
    $(".answer_frequency_period").change(function () {
        for (var i = 0; i < 100; i++) {
            $(".answer_frequency_count").append('<option value="' + (i + 1) + '">' +
                (i + 1) + '</option>');
        }
    })

    //######################################
    //Yesボタンを押したとき
    //######################################
    $(".btn_yes").on("click", function () {
        //plazaのクラスの基本がanswer-offを排除してtest2-onになってる
        if ($(".plaza").hasClass("test2-on")) {
            //チェックボックスの固定チェックを外す(選ばれた生活指標カテゴリー)
            $('.checkbox_health').prop('checked', false);
            $('.checkbox_health').prop('disabled', false);
            $('.checkbox_mind').prop('checked', false);
            $('.checkbox_mind').prop('disabled', false);
            $('.checkbox_sociality').prop('checked', false);
            $('.checkbox_sociality').prop('disabled', false);
            $('.checkbox_expression').prop('checked', false);
            $('.checkbox_expression').prop('disabled', false);

            $(".btn_attach_forward").addClass("is-disabled");
            $(".plaza").removeClass("test2-on");
            $(".plaza").addClass("answer-off");
            $(".btn_yes").fadeOut(500);
            $(".btn_no").fadeOut(500);
            $(".btn_next").fadeIn(500);
            data_yes = { "who": -1, "talk": "第2の実験お疲れ様。<br>手伝ってくれてありがとう。" };
            display_talk(data_yes, current_user.name, 0, categories, avators);
        } else if ($(".plaza").hasClass("test2-plaza-on")) {
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_yes").fadeOut(500);
            $(".btn_no").fadeOut(500, function () {
                data_yes = { "who": -1, "talk": "それじゃあどんな指標を<br>見つけたのか教えてくれないかな。" };
                display_talk(data_yes, current_user.name, 0, categories, avators);
                $(".btn_yes").prop("disabled", false);
                $(".btn_no").prop("disabled", false);
                $(".btn_submit").prop("disabled", true);
                $(".btn_cancel").prop("disabled", true);
                $(".btn_history").animate({
                    width: "98px"
                }, 500, function () {
                    $(".btn_help").fadeIn(500);
                    $(".btn_routines").fadeIn(500);
                });
                $(".form").fadeIn(500, function () {
                    $(".plaza").removeClass("test2-plaza-on");
                    $(".plaza").addClass("test2-answer-plaza-on");
                    $(".btn_submit").prop("disabled", false);
                    $(".btn_cancel").prop("disabled", false);
                });
            });
        } else if ($(".plaza").hasClass("test2-answer-plaza-on")) {
            $(".plaza").removeClass("test2-answer-plaza-on");
            $(".plaza").addClass("test2-plaza-on");
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_next_plaza").prop("disabled", true);
            $(".btn_yes").fadeOut(500);
            $(".btn_no").fadeOut(500, function () {
                data_yes = { "who": -1, "talk": "次はもっといい意見が<br>見つかるかな。期待だね。" };
                display_talk(data_yes, current_user.name, 0, categories, avators);
                $(".btn_next_plaza").fadeIn(500, function () {
                    $(".btn_next_plaza").prop("disabled", false);
                    $(".btn_yes").prop("disabled", false);
                    $(".btn_no").prop("disabled", false);
                });
            });
            //formの入力内容を消去する
            $(".answer_text").val("");
            $(".answer_frequency_period option[value='0']").prop('selected', true);
            $(".answer_frequency_count option[value='0']").prop('selected', true);
            checkbox_select(4);
        } else if ($(".plaza").hasClass("backToRecord")) {
            //記録画面ボタンが押されたとき、退出するを選択すると記録画面に遷移する
            window.location.href = '/';
        }
    });

    //######################################
    //Noボタンを押したとき
    //######################################
    $(".btn_no").on("click", function () {
        if ($(".plaza").hasClass("test2-on")) {
            $(".btn_attach_forward").removeClass("is-disabled");
            $(".btn_yes").fadeOut(500);
            $(".btn_no").fadeOut(500, function () {
                $(".btn_enter").fadeIn(500);
            });
            $(".btn_history").animate({
                width: "98px"
            }, 500, function () {
                $(".btn_plaza").fadeIn(500);
                $(".btn_help").fadeIn(500);
                $(".btn_routines").fadeIn(500);
            });
            data_yes = { "who": -1, "talk": "探す指標カテゴリーはこれ。<br>first_category,<br>よろしくね。" };
            display_talk(data_yes, current_user.name, 0, categories, avators);
        } else if ($(".plaza").hasClass("test2-plaza-on")) {
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_yes").fadeOut(500);
            $(".btn_no").fadeOut(500, function () {
                data_no = { "who": -1, "talk": "次はもっといい意見が<br>見つかるかな。期待だね。" };
                display_talk(data_no, current_user.name, 0, categories, avators);
                $(".btn_next_plaza").fadeIn(500, function () {
                    $(".btn_next_plaza").prop("disabled", false);
                });
                $(".btn_yes").prop("disabled", false);
                $(".btn_no").prop("disabled", false);
            });
        } else if ($(".plaza").hasClass("test2-answer-plaza-on")) {
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_submit").prop("disabled", true);
            $(".btn_cancel").prop("disabled", true);
            $(".btn_yes").fadeOut(500);
            $(".btn_no").fadeOut(500, function () {
                data_no = { "who": -1, "talk": "どんな指標を見つけたのか<br>教えてくれないかな。" };
                display_talk(data_no, current_user.name, 0, categories, avators);
                $(".btn_history").animate({
                    width: "98px"
                }, 500, function () {
                    $(".btn_help").fadeIn(500);
                    $(".btn_routines").fadeIn(500);
                });
                $(".form").fadeIn(500, function () {
                    $(".btn_yes").prop("disabled", false);
                    $(".btn_no").prop("disabled", false);
                    $(".btn_submit").prop("disabled", false);
                    $(".btn_cancel").prop("disabled", false);
                });
            });
        } else if ($(".plaza").hasClass("backToRecord")) {
            //記録画面ボタンを押したときにいいえを押すともどる
            $(".plaza").removeClass("backToRecord");
            $(".plaza").addClass("test2-on");
            $(".btn_enter").prop("disabled", true);
            $(".btn_plaza").prop("disabled", true);
            $(".btn_record").prop("disabled", true);
            $(".btn_history").prop("disabled", true);
            $(".btn_routines").prop("disabled", true);
            $(".btn_help").prop("disabled", true);
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            data_no = { "who": -1, "talk": "生活指標入力は入力ボタン、<br>戻る場合は記録画面ボタン<br>を押してね。" };
            display_talk(data_no, current_user.name, 0, categories, avators);
            $(".btn_yes").fadeOut(500);
            $(".btn_no").fadeOut(500, function () {
                $(".btn_enter").fadeIn(500);
                $(".btn_plaza").fadeIn(500);
                $(".btn_record").fadeIn(500);
                $(".btn_history").fadeIn(500);
                $(".btn_routines").fadeIn(500);
                $(".btn_help").fadeIn(500, function () {
                    $(".btn_yes").prop("disabled", false);
                    $(".btn_no").prop("disabled", false);
                    $(".btn_enter").prop("disabled", false);
                    $(".btn_plaza").prop("disabled", false);
                    $(".btn_record").prop("disabled", false);
                    $(".btn_history").prop("disabled", false);
                    $(".btn_routines").prop("disabled", false);
                    $(".btn_help").prop("disabled", false);
                });
            });
        }
    });

    //######################################
    //送信ボタンを押したとき
    //######################################
    $(".btn_submit").on("click", function () {
        if ($(".plaza").hasClass("test2-answer-on") || $(".plaza").hasClass("test2-answer-plaza-on")) {
            //###############################################
            //フォーム画面から初めて決定を押すとき
            //###############################################
            $(".btn_submit").prop("disabled", true);
            $(".btn_cancel").prop("disabled", true);
            var check_text = $(".answer_text").val();
            var check_period = $(".answer_frequency_period option:selected").val();
            var check_count = $(".answer_frequency_count option:selected").val();
            var check_category = [];
            var check_categories = ["health", "mind", "sociality", "expression"];
            var answer_period = $(".answer_frequency_period option:selected").text();
            //var answer_count = $(".answer_frequency_count option:selected").text(); == val()
            var answer_categories = [];
            var answer_category = "";
            for (var i = 0; i < check_categories.length; i++) {
                var category_class = ".checkbox_" + check_categories[i];
                check_category.push($(category_class).prop("checked"));
                if ($(category_class).prop("checked")) {
                    answer_categories.push($(category_class).val());
                }
            }
            //入力フォームが全部入力されていた時
            if (check_text != "" && check_period != 0 &&
                check_count != 0 && check_category.indexOf(true) != -1) {
                var check_text_routines = true;
                for (var i = 0; i < user_routines.length; i++) {
                    if (check_text == user_routines[i].text) {
                        check_text_routines = false;
                    }
                }
                //すでに入力した生活指標を持っているかどうか
                //FIXME: 文字や言語の種類が違うだけで同じ内容の指標がデータベースに登録されてしまう...
                if (check_text_routines) {
                    //TODO:if(安田のオントロジーモジュールで入力内容が正しいか判定したいな)
                    //FIXME: 入力が全部されていてもroutine.textがwikidata上で妥当かを判断とか？
                    $(".answer_text_container").fadeOut(500);
                    $(".answer_frequency_container").fadeOut(500);
                    $(".answer_category_container").fadeOut(500, function () {
                        data_submit = { "who": -1, "talk": "これでいいかな？" };
                        display_talk(data_submit, current_user.name, 0, categories, avators);
                        $(".answer_routine").append("<p>生活指標：" + check_text + "</p>");
                        $(".answer_routine").append("<p>頻度：" + answer_period +
                            ", 回数：" + check_count + "</p>");
                        for (var i = 0; i < answer_categories.length; i++) {
                            if (i < answer_categories.length - 1) {
                                answer_category = answer_category + answer_categories[i] + ", ";
                            } else if (i == answer_categories.length - 1) {
                                answer_category = answer_category + answer_categories[i];
                            }
                            if (i == 1) {
                                answer_category = answer_category + "<br>　　　";
                            }
                        }
                        $(".answer_routine").append("<p>分類：" + answer_category + "</p>");
                        $(".answer_routine").fadeIn(500, function () {
                            if ($(".plaza").hasClass("answer-on")) {
                                $(".plaza").removeClass("answer-on");
                                $(".plaza").addClass("answer-check");
                            } else if ($(".plaza").hasClass("test1-answer-on")) {
                                $(".plaza").removeClass("test1-answer-on");
                                $(".plaza").addClass("test1-answer-check");
                            } else if ($(".plaza").hasClass("test2-answer-on")) {
                                $(".plaza").removeClass("test2-answer-on");
                                $(".plaza").addClass("test2-answer-check");
                            } else if ($(".plaza").hasClass("test2-answer-plaza-on")) {
                                $(".plaza").removeClass("test2-answer-plaza-on");
                                $(".plaza").addClass("test2-answer-plaza-check");
                            }
                            $(".btn_submit").prop("disabled", false);
                            $(".btn_cancel").prop("disabled", false);
                        });
                    });
                } else {
                    data_submit = { "who": -1, "talk": "その生活指標は<br>もう持っているらしいよ。" };
                    display_talk(data_submit, current_user.name, 0, categories, avators);
                    $(".btn_submit").prop("disabled", false);
                    $(".btn_cancel").prop("disabled", false);
                }
            } else {
                data_submit = { "who": -1, "talk": "入力されてない項目があるよ。" };
                display_talk(data_submit, current_user.name, 0, categories, avators);
                $(".btn_submit").prop("disabled", false);
                $(".btn_cancel").prop("disabled", false);
            }

        } else if ($(".plaza").hasClass("test2-answer-check")) {
            //###############################################
            //最終確認を行ってから実際に指標登録を行うとき(入力ボタンの指標入力)
            //###############################################
            $(".btn_submit").prop("disabled", true);
            $(".btn_cancel").prop("disabled", true);
            //指標と
            var answer_text = $(".answer_text").val();
            var answer_period = $(".answer_frequency_period option:selected").val();
            if (answer_period == 1) {
                answer_period = 1;
            } else if (answer_period == 2) {
                answer_period = 7;
            } else if (answer_period == 3) {
                answer_period = 30;
            } else if (answer_period == 4) {
                answer_period = 365;
            }
            var answer_count = $(".answer_frequency_count option:selected").val();
            var answer_category = [];
            answer_category.push($(".checkbox_health").prop("checked"));
            answer_category.push($(".checkbox_mind").prop("checked"));
            answer_category.push($(".checkbox_sociality").prop("checked"));
            answer_category.push($(".checkbox_expression").prop("checked"));

            //入力指標の最終確認をした後に決定ボタン
            $.ajax({
                url: '/plaza/routines_new',
                type: 'POST',
                data: {
                    "routine_text": answer_text,
                    "routine_period": answer_period,
                    "routine_count": answer_count,
                    "categories": answer_category,
                    "referenced_routine_text": "ByOneself",
                    "referenced_category": -1
                }
            })
                // Ajaxリクエストが成功した時発動
                .done((data) => {
                    //ユーザの生活指標リストに入力された指標を追加
                    $(".answer_routine").fadeOut(500, function () {
                        $(".answer_routine").html("");
                        $(".answer_text_container").fadeIn(500);
                        $(".answer_frequency_container").fadeIn(500);
                        $(".answer_category_container").fadeIn(500);
                    });
                    var routine_categories = "";
                    var routine_categories_index = [];
                    for (var i = 0; i < answer_category.length; i++) {
                        if (answer_category[i] == true) {
                            routine_categories_index.push(i);
                        }
                    }
                    for (var i = 0; i < routine_categories_index.length; i++) {
                        if (i < routine_categories_index.length - 1) {
                            if (routine_categories_index[i] == 0) {
                                routine_categories = routine_categories + "身体、";
                            } else if (routine_categories_index[i] == 1) {
                                routine_categories = routine_categories + "感覚、";
                            } else if (routine_categories_index[i] == 2) {
                                routine_categories = routine_categories + "対人関係、";
                            } else if (routine_categories_index[i] == 3) {
                                routine_categories = routine_categories + "学び/精神、";
                            }
                        } else if (i == routine_categories_index.length - 1) {
                            if (routine_categories_index[i] == 0) {
                                routine_categories = routine_categories + "身体";
                            } else if (routine_categories_index[i] == 1) {
                                routine_categories = routine_categories + "感覚";
                            } else if (routine_categories_index[i] == 2) {
                                routine_categories = routine_categories + "対人関係";
                            } else if (routine_categories_index[i] == 3) {
                                routine_categories = routine_categories + "学び/精神";
                            }
                        }
                    }
                    $(".routines_list").append("<p class=\"routines_text\">" + answer_text + "<br>(<span class=\"routines_routine\">" + routine_categories + "</span>)</p>");
                    //後処理
                    $(".plaza").removeClass("test2-answer-check");
                    $(".plaza").addClass("test2-on");
                    $(".form").fadeOut(500, function () {
                        $(".btn_enter").prop("disabled", true);
                        $(".btn_plaza").prop("disabled", true);
                        $(".btn_record").prop("disabled", true);
                        $(".btn_enter").fadeIn(500);
                        $(".btn_plaza").fadeIn(500);
                        $(".btn_record").fadeIn(500);
                        $(".btn_submit").prop("disabled", false);
                        $(".btn_cancel").prop("disabled", false);
                        $(".answer_text").val("");
                        $(".answer_frequency_period option[value='0']").prop('selected', true);
                        $(".answer_frequency_count option[value='0']").prop('selected', true);
                        checkbox_select(4);
                        data_submit = { "who": -1, "talk": "登録完了！" };
                        display_talk(data_submit, current_user.name, 0, categories, avators);
                        $(".btn_enter").prop("disabled", false);
                        $(".btn_plaza").prop("disabled", false);
                        $(".btn_record").prop("disabled", false);
                        //$(".btn_attach_forward").removeClass("is-disabled");
                    });
                })
                // Ajaxリクエストが失敗した時発動
                .fail((data) => {
                    console.log("データ送信、受信に失敗");
                })
                // Ajaxリクエストが成功・失敗どちらでも発動
                .always((data) => {

                });
        } else if ($(".plaza").hasClass("test2-answer-plaza-check")) {
            //###############################################
            //最終確認を行ってから実際に指標登録を行うとき(意見参考ボタンの指標入力)
            //###############################################
            $(".btn_submit").prop("disabled", true);
            $(".btn_cancel").prop("disabled", true);
            //指標と
            var answer_text = $(".answer_text").val();
            var answer_period = $(".answer_frequency_period option:selected").val();
            if (answer_period == 1) {
                answer_period = 1;
            } else if (answer_period == 2) {
                answer_period = 7;
            } else if (answer_period == 3) {
                answer_period = 30;
            } else if (answer_period == 4) {
                answer_period = 365;
            }
            var answer_count = $(".answer_frequency_count option:selected").val();
            var answer_category = [];
            answer_category.push($(".checkbox_health").prop("checked"));
            answer_category.push($(".checkbox_mind").prop("checked"));
            answer_category.push($(".checkbox_sociality").prop("checked"));
            answer_category.push($(".checkbox_expression").prop("checked"));

            $.ajax({
                url: '/plaza/routines_new',
                type: 'POST',
                data: {
                    "routine_text": answer_text,
                    "routine_period": answer_period,
                    "routine_count": answer_count,
                    "categories": answer_category,
                    "referenced_routine_text": category_routines[referenced_routine_index].text,
                    "referenced_category": categories[referenced_routine_index]
                }
            })
                // Ajaxリクエストが成功した時発動
                .done((data) => {
                    //ユーザの生活指標リストに入力された指標を追加
                    $(".answer_routine").fadeOut(500, function () {
                        $(".answer_routine").html("");
                        $(".answer_text_container").fadeIn(500);
                        $(".answer_frequency_container").fadeIn(500);
                        $(".answer_category_container").fadeIn(500);
                    });
                    var routine_categories = "";
                    var routine_categories_index = [];
                    for (var i = 0; i < answer_category.length; i++) {
                        if (answer_category[i] == true) {
                            routine_categories_index.push(i);
                        }
                    }
                    for (var i = 0; i < routine_categories_index.length; i++) {
                        if (i < routine_categories_index.length - 1) {
                            if (routine_categories_index[i] == 0) {
                                routine_categories = routine_categories + "身体、";
                            } else if (routine_categories_index[i] == 1) {
                                routine_categories = routine_categories + "感覚、";
                            } else if (routine_categories_index[i] == 2) {
                                routine_categories = routine_categories + "対人関係、";
                            } else if (routine_categories_index[i] == 3) {
                                routine_categories = routine_categories + "学び/精神、";
                            }
                        } else if (i == routine_categories_index.length - 1) {
                            if (routine_categories_index[i] == 0) {
                                routine_categories = routine_categories + "身体";
                            } else if (routine_categories_index[i] == 1) {
                                routine_categories = routine_categories + "感覚";
                            } else if (routine_categories_index[i] == 2) {
                                routine_categories = routine_categories + "対人関係";
                            } else if (routine_categories_index[i] == 3) {
                                routine_categories = routine_categories + "学び/精神";
                            }
                        }
                    }
                    $(".routines_list").append("<p class=\"routines_text\">" + answer_text + "<br>(<span class=\"routines_routine\">" + routine_categories + "</span>)</p>");
                    //後処理
                    $(".plaza").removeClass("test2-answer-plaza-check");
                    $(".plaza").addClass("test2-plaza-on");
                    $(".form").fadeOut(500, function () {
                        $(".btn_submit").prop("disabled", false);
                        $(".btn_cancel").prop("disabled", false);
                        $(".answer_text").val("");
                        $(".answer_frequency_period option[value='0']").prop('selected', true);
                        $(".answer_frequency_count option[value='0']").prop('selected', true);
                        checkbox_select(4);
                        data_submit = { "who": -1, "talk": "登録完了したよ。<br>いい生活指標は見つかったかな？" };
                        display_talk(data_submit, current_user.name, 0, categories, avators);
                        $(".btn_routines").fadeOut(500, function () {
                            $(".btn_history").animate({ width: "150px" }, 500);
                            $(".btn_next_plaza").prop("disabled", true);
                            $(".btn_next_plaza").fadeIn(500, function () {
                                $(".btn_next_plaza").prop("disabled", false);
                            });
                        });
                        $(".btn_help").fadeOut(500);
                    });
                })
                // Ajaxリクエストが失敗した時発動
                .fail((data) => {
                    console.log("データ送信、受信に失敗");
                })
                // Ajaxリクエストが成功・失敗どちらでも発動
                .always((data) => {

                });
        }
    });

    //######################################
    //キャンセルボタンを押したとき
    //######################################
    $(".btn_cancel").on("click", function () {
        if ($(".plaza").hasClass("test2-answer-check") || $(".plaza").hasClass("test2-answer-plaza-check")) {
            $(".btn_submit").prop("disabled", true);
            $(".btn_cancel").prop("disabled", true);
            $(".answer_routine").fadeOut(500, function () {
                if ($(".plaza").hasClass("answer-check")) {
                    $(".plaza").removeClass("answer-check");
                    $(".plaza").addClass("answer-on");
                } else if ($(".plaza").hasClass("test1-answer-check")) {
                    $(".plaza").removeClass("test1-answer-check");
                    $(".plaza").addClass("test1-answer-on");
                } else if ($(".plaza").hasClass("test2-answer-check")) {
                    $(".plaza").removeClass("test2-answer-check");
                    $(".plaza").addClass("test2-answer-on");
                } else if ($(".plaza").hasClass("test2-answer-plaza-check")) {
                    $(".plaza").removeClass("test2-answer-plaza-check");
                    $(".plaza").addClass("test2-answer-plaza-on");
                }
                data_cancel = { "who": -1, "talk": "どんな指標を見つけたのか<br>教えてくれないかな。" };
                display_talk(data_cancel, current_user.name, 0, categories, avators);
                $(".answer_routine").html("");
                $(".answer_text_container").fadeIn(500);
                $(".answer_frequency_container").fadeIn(500);
                $(".answer_category_container").fadeIn(500);
                $(".btn_submit").prop("disabled", false);
                $(".btn_cancel").prop("disabled", false);
            });
        } else if ($(".plaza").hasClass("test2-answer-on")) {
            //入力ボタンを押した後の指標入力フォームでキャンセルボタン
            $(".plaza").removeClass("test2-answer-on");
            $(".plaza").addClass("test2-on");
            $(".form").fadeOut(500, function () {
                //form内容を削除
                $(".answer_text").val("");
                $(".answer_frequency_period option[value='0']").prop('selected', true);
                $(".answer_frequency_count option[value='0']").prop('selected', true);
                checkbox_select(4);

                $(".btn_enter").fadeIn(500);
                $(".btn_plaza").fadeIn(500);
                $(".btn_record").fadeIn(500);
                data_cancel = { "who": -1, "talk": "生活指標入力は入力ボタン、<br>戻る場合は記録画面ボタン<br>を押してね。" };
                display_talk(data_cancel, current_user.name, 0, categories, avators);
            });
        } else if ($(".plaza").hasClass("test2-answer-plaza-on")) {
            //意見参考機能利用時の指標入力フォームでキャンセルボタン
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_submit").prop("disabled", true);
            $(".btn_cancel").prop("disabled", true);
            $(".btn_routines").fadeOut(500, function () {
                $(".btn_history").animate({ width: "150px" }, 500);
            });
            $(".btn_help").fadeOut(500);
            $(".form").fadeOut(500, function () {
                data_cancel = { "who": -1, "talk": "生活指標の登録をやめる？" };
                display_talk(data_cancel, current_user.name, 0, categories, avators);
                $(".btn_yes").fadeIn(500);
                $(".btn_no").fadeIn(500, function () {
                    $(".btn_yes").prop("disabled", false);
                    $(".btn_no").prop("disabled", false);
                    $(".btn_submit").prop("disabled", false);
                    $(".btn_cancel").prop("disabled", false);
                });
            });
        }
    });

    //######################################
    //入力ボタンを押したとき
    //######################################
    $(".btn_enter").on("click", function () {
        $(".plaza").removeClass("test2-on");
        $(".plaza").addClass("test2-answer-on");
        $(".btn_enter").fadeOut(500);
        $(".btn_plaza").fadeOut(500);
        $(".btn_record").fadeOut(500, function () {
            $(".form").fadeIn(500);
        });
        data_enter = { "who": -1, "talk": "どんな指標を見つけたのか<br>教えてくれないかな。" };
        display_talk(data_enter, current_user.name, 0, categories, avators);
    });

    //#####################################################################
    //#####################################################################
    //######################################
    //意見参考ボタンを押したとき
    //######################################
    //#####################################################################
    //#####################################################################
    $(".btn_plaza").on("click", function () {
        if (plaza_count < 1) {
            $(".plaza").removeClass("test2-on");
            $(".plaza").addClass("test2-plaza-on");
            $(".btn_attach_forward").addClass("is-disabled");
            $(".btn_enter").prop("disabled", true);
            $(".btn_plaza").prop("disabled", true);
            $(".btn_record").prop("disabled", true);
            $(".btn_enter").fadeOut(500);
            $(".btn_plaza").fadeOut(500);
            $(".btn_record").fadeOut(500);
            $(".btn_routines").fadeOut(500, function () {
                $(".btn_history").animate({ width: "150px" }, 500, function () {
                    $(".btn_enter").prop("disabled", false);
                    $(".btn_plaza").prop("disabled", false);
                    $(".btn_record").prop("disabled", false);
                    $(".btn_next_plaza").fadeIn(500);
                });
            });
            $(".btn_help").fadeOut(500);
            //FIXME:使用会話テンプレートファイルを追加するなど
            //使用template_jsonファイルを選択
            var template_talking_plaza = "/template_talking_new.json";
            /* (元プログラム)
            var template_index = Math.floor(Math.random() * 3 + 1);
            var template_talking_plaza = "/template_talking_plaza" + template_index + ".json";
            */

            $.getJSON(template_talking_plaza, function (data_plaza) {
                //######################################
                //テンプレート進行
                //######################################
                display_talk(data_plaza[0], current_user.name, category_routines, categories, avators);
                if (plaza_count == 0) {
                    $(".btn_next_plaza").on("click", function () {
                        if (i_plaza1 < data_plaza.length && plaza_count == 0) {
                            //テンプレート会話実行
                            $(".btn_next_plaza").prop("disabled", true);
                            //画面が遷移した時、前画面で動いていたキャラ画像を静止画に書き換える
                            if (data_plaza[i_plaza1].who != data_plaza[i_plaza1 - 1].who) {
                                if (data_plaza[i_plaza1 - 1].who < 0) {
                                    $(".fairy").attr("src", image_path("imgs/fairy/fairy_winter1.png"));
                                } else if (data_plaza[i_plaza1 - 1].who == 0) {
                                    $(".char_left").attr("src", image_path(avators_imgs[0][0]));
                                } else if (data_plaza[i_plaza1 - 1].who == 1) {
                                    $(".char_center").attr("src", image_path(avators_imgs[1][0]));
                                } else if (data_plaza[i_plaza1 - 1].who == 2) {
                                    $(".char_right").attr("src", image_path(avators_imgs[2][0]));
                                }
                            }
                            //画面を遷移させてしゃべっているキャラを明確にする+しゃべらせる
                            if (data_plaza[i_plaza1].who < 0 || data_plaza[i_plaza1].who == 1) {
                                swiper.slideTo(1);
                                if (data_plaza[i_plaza1].who < 0) {
                                    $(".fairy").attr("src", image_path("imgs/fairy/fairy_winter1.gif"));
                                    $(".talker").attr("src", image_path("imgs/fairy/fairy_winter1.png"));
                                } else if (data_plaza[i_plaza1].who == 1) {
                                    $(".char_center").attr("src", image_path(avators_imgs[1][1]));
                                    $(".talker").attr("src", image_path(avators_imgs[1][0]));
                                }
                            } else if (data_plaza[i_plaza1].who == 0) {
                                swiper.slideTo(0);
                                $(".char_left").attr("src", image_path(avators_imgs[0][1]));
                                $(".talker").attr("src", image_path(avators_imgs[0][0]));
                            } else if (data_plaza[i_plaza1].who == 2) {
                                swiper.slideTo(2);
                                $(".char_right").attr("src", image_path(avators_imgs[2][1]));
                                $(".talker").attr("src", image_path(avators_imgs[2][0]));
                            }
                            display_talk(data_plaza[i_plaza1], current_user.name, category_routines, categories, avators);
                            i_plaza1 = i_plaza1 + 1;
                        } else if (i_plaza1 == data_plaza.length && plaza_count == 0) {
                            plaza_count += 1;
                            i_plaza1 = i_plaza1 + 1;
                            //テンプレート会話終了後
                            $(".plaza").removeClass("test2-plaza-on");
                            $(".plaza").addClass("test2-on");
                            $(".btn_enter").prop("disabled", true);
                            $(".btn_plaza").prop("disabled", true);
                            $(".btn_record").prop("disabled", true);
                            $(".btn_next_plaza").fadeOut(500);
                            $(".btn_history").animate({ width: "98px" }, 500, function () {
                                $(".btn_routines").fadeIn(500);
                                $(".btn_help").fadeIn(500);
                                $(".btn_enter").fadeIn(500);
                                $(".btn_plaza").fadeIn(500, function () {
                                    $(".btn_enter").prop("disabled", false);
                                    $(".btn_plaza").prop("disabled", false);
                                    $(".btn_record").prop("disabled", false);
                                });
                                $(".btn_record").fadeIn(500);
                            });
                            data_plaza_next = { "who": -1, "talk": "生活指標入力は入力ボタン、<br>戻る場合は記録画面ボタン<br>を押してね。" };
                            display_talk(data_plaza_next, current_user.name, category_routines, categories, avators);
                        }
                    });
                }

            });
        } else {
            data_plaza_next = { "who": -1, "talk": "この機能はもう使えないよ。<br>参考になった意見はあったかな？<br>終了時は記録画面ボタンだよ。" };
            display_talk(data_plaza_next, current_user.name, 0, categories, avators);
        }
    });

    //######################################
    //記録画面ボタンを押したとき
    //######################################
    $(".btn_record").on("click", function () {
        //記録画面に戻るかの確認をする
        //はい；記録画面へ、いいえ：キャンセル
        $(".plaza").removeClass("test2-on");
        $(".plaza").addClass("backToRecord");
        $(".btn_enter").prop("disabled", true);
        $(".btn_plaza").prop("disabled", true);
        $(".btn_record").prop("disabled", true);
        $(".btn_history").prop("disabled", true);
        $(".btn_routines").prop("disabled", true);
        $(".btn_help").prop("disabled", true);
        $(".btn_yes").prop("disabled", true);
        $(".btn_no").prop("disabled", true);
        data_no = { "who": -1, "talk": "広場画面を退出する？" };
        display_talk(data_no, current_user.name, 0, categories, avators);
        $(".btn_enter").fadeOut(500);
        $(".btn_plaza").fadeOut(500);
        $(".btn_record").fadeOut(500);
        $(".btn_history").fadeOut(500);
        $(".btn_routines").fadeOut(500);
        $(".btn_help").fadeOut(500, function () {
            $(".btn_yes").fadeIn(500);
            $(".btn_no").fadeIn(500, function () {
                $(".btn_yes").prop("disabled", false);
                $(".btn_no").prop("disabled", false);
                $(".btn_enter").prop("disabled", false);
                $(".btn_plaza").prop("disabled", false);
                $(".btn_record").prop("disabled", false);
                $(".btn_history").prop("disabled", false);
                $(".btn_routines").prop("disabled", false);
                $(".btn_help").prop("disabled", false);
            });
        });
        //記録画面ボタン(元次へボタン)で記録画面に遷移
        //TODO:FIXME: 記録画面以外（安田の質問画面）にも遷移したい
        //window.location.href = '/';
    });


    //####################################################################################################
    //使用関数  ##########################################################################################
    //####################################################################################################

    //######################################
    //会話文を表示させる & 履歴に会話文を追加
    //文字を1文字ずつ表示する
    //######################################
    // data：会話の当事者、会話内容
    // current_user_name：ユーザ名
    // 
    // avators：エージェント名
    function display_talk(data, current_user_name, category_routines, categories, avators) {
        var talking = data.talk;
        //履歴に追加する
        if (data.who < 0) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">プラザ</p>");
            talking = replace_talk(current_user_name, talking, category_routines, categories, avators);
            $(".talk_who").text("プラザ");
        } else if (data.who == 0) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">" + avators[0] + "</p>");
            talking = replace_talk(current_user_name, talking, category_routines, categories, avators);
            $(".talk_who").text(avators[0]);
        } else if (data.who == 1) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">" + avators[1] + "</p>");
            talking = replace_talk(current_user_name, talking, category_routines, categories, avators);
            $(".talk_who").text(avators[1]);
        } else if (data.who == 2) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">" + avators[2] + "</p>");
            talking = replace_talk(current_user_name, talking, category_routines, categories, avators);
            $(".talk_who").text(avators[2]);
        }
        $(".talk_history_list").append("<p" + talking + "</p>");
        //talkingから会話以外の無駄な内容（class定義）を消す
        if (talking.indexOf(" class=\"talk_history_back\">") != -1) {
            talking = talking.replace(" class=\"talk_history_back\">", "");
        } else if (talking.indexOf(">") != -1) {
            talking = talking.replace(">", "");
        }
        //全文字をspanタグで囲む
        $(".talk_text").css({ "opacity": 0 });
        $(".talk_text span").css({ "opacity": 0 });
        $(".talk_text").html(talking);
        $(".talk_text").children().andSelf().contents().each(function () {
            if (this.nodeType == 3) {
                $(this).replaceWith($(this).text().replace(/(\S)/g, '<span>$1</span>'));
            }
        });
        //文字を1文字ずつ表示する
        $(".talk_text").css({ "opacity": 1 });
        for (var i = 0; i <= $(".talk_text").children().size(); i++) {
            $(".talk_text").children("span:eq(" + i + ")").delay(35 * i).animate({ "opacity": 1 }, 50);
        };
        //ユーザの応答へと遷移
        if (data.who == -2) {
            //nextボタンを消して、Yes/Noボタンで返答を行うように誘導
            //次へボタンが "btn_next"
            //「今の話を聞いてなにか新しい生活指標は思いついた？」用
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_next").fadeOut(500);
            $(".btn_yes").fadeIn(500);
            $(".btn_no").fadeIn(500, function () {
                $(".btn_yes").prop("disabled", false);
                $(".btn_no").prop("disabled", false);
            });
        } else {
            $(".btn_next").prop("disabled", false);
        }
        if (data.who == -5) {
            //nextボタンを消して、Yes/Noボタンで返答を行うように誘導
            //次へボタンが "btn_next_plaza"
            //「今の話を聞いてなにか新しい生活指標は思いついた？」用
            //一個の生活指標が紹介されるとreferenced_routine_indexの値がインクリメントされ、
            //  生活指標登録の際にどの生活指標を参考にしたのかを知ることができるようになっている
            //  referenced_routine_index:参考にしている生活指標のインデックス
            referenced_routine_index = referenced_routine_index + 1;
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_next_plaza").fadeOut(500);
            $(".btn_yes").fadeIn(500);
            $(".btn_no").fadeIn(500, function () {
                $(".btn_yes").prop("disabled", false);
                $(".btn_no").prop("disabled", false);
            });
        } else {
            $(".btn_next_plaza").prop("disabled", false);
        }
        if (data.who == -3) {
            //「探す指標カテゴリーはこれ」用
            //評価実験1で使用
            //"意見参考"ボタンなし
            $(".plaza").removeClass("answer-off");
            $(".plaza").addClass("test1-on");
            $(".test_tutorial1").css("visibility", "visible");
            $(".btn_next").fadeOut(500);
            $(".btn_history").animate({
                width: "98px"
            }, 500, function () {
                $(".btn_enter").fadeIn(500);
                $(".btn_help").fadeIn(500);
                $(".btn_routines").fadeIn(500);
            });
        }
        if (data.who == -4) {
            //「探す指標カテゴリーはこれ」用
            //評価実験2で使用
            //"意見参考"ボタンあり
            $(".plaza").removeClass("answer-off");
            $(".plaza").addClass("test2-on");
            $(".test_tutorial2").css("visibility", "visible");
            $(".btn_next").fadeOut(500);
            $(".btn_history").animate({
                width: "98px"
            }, 500, function () {
                $(".btn_plaza").fadeIn(500);
                $(".btn_enter").fadeIn(500);
                $(".btn_help").fadeIn(500);
                $(".btn_routines").fadeIn(500);
            });
        }
    }

    //######################################
    //キャラクターの話の中で現れるname,とlife_index,をキャラの名前、指標に置換する
    //######################################
    function replace_talk(current_user_name, template_talk, talk_routines, categories, avators) {
        var talking = template_talk;
        var category_name = "";
        var replace_check = false;

        //ユーザの名前: current_user,
        if (talking.indexOf("current_user,") != -1) {
            talking = talking.replace("current_user,", "「" + current_user_name + "」");
        }
        //周期情報と生活指標名を返す
        if (talking.indexOf("frequency0,") != -1) {
            var index = plaza_count * 3;
            var str_frequency = make_routine_frequency(talk_routines[index].period, talk_routines[index].count);
            talking = talking.replace("frequency0,", "「" + str_frequency + "」");
            replace_check = true;
        } else if (talking.indexOf("frequency1,") != -1) {
            var index = plaza_count * 3 + 1;
            var str_frequency = make_routine_frequency(talk_routines[index].period, talk_routines[index].count);
            talking = talking.replace("frequency1,", "「" + str_frequency + "」");
            replace_check = true;
        } else if (talking.indexOf("frequency2,") != -1) {
            var index = plaza_count * 3 + 2;
            var str_frequency = make_routine_frequency(talk_routines[index].period, talk_routines[index].count);
            talking = talking.replace("frequency2,", "「" + str_frequency + "」");
            replace_check = true;
        }
        if (talking.indexOf("routine0,") != -1) {
            var index = plaza_count * 3;
            talking = talking.replace("routine0,", "「" + talk_routines[index].text + "」");
            replace_check = true;
        } else if (talking.indexOf("routine1,") != -1) {
            var index = plaza_count * 3 + 1;
            talking = talking.replace("routine1,", "「" + talk_routines[index].text + "」");
            replace_check = true;
        } else if (talking.indexOf("routine2,") != -1) {
            var index = plaza_count * 3 + 2;
            talking = talking.replace("routine2,", "「" + talk_routines[index].text + "」");
            replace_check = true;
        }
        //会話中の生活指標カテゴリー名を変換
        if (talking.indexOf("category0,") != -1) {
            category_name = return_category_name(categories[0]);
            talking = talking.replace("category0,", "「" + category_name + "」");
        } else if (talking.indexOf("category1,") != -1) {
            category_name = return_category_name(categories[1]);
            talking = talking.replace("category1,", "「" + category_name + "」");
        } else if (talking.indexOf("category2,") != -1) {
            category_name = return_category_name(categories[2]);
            talking = talking.replace("category2,", "「" + category_name + "」");
        }
        //会話中のエージェント名を変換
        if (talking.indexOf("avator0,") != -1) {
            talking = talking.replace("avator0,", avators[0]);
        } else if (talking.indexOf("avator1,") != -1) {
            talking = talking.replace("avator1,", avators[1]);
        } else if (talking.indexOf("avator2,") != -1) {
            talking = talking.replace("avator2,", avators[2]);
        }
        //生活指標の情報が含まれているかどうか
        if (replace_check == true) {
            return " class=\"talk_history_back\">" + talking;
        } else {
            return ">" + talking;
        }
    }

    //######################################
    //指標の周期と回数から頻度を生成 ########
    //######################################
    function make_routine_frequency(period, count) {
        var str = "";
        if (period == 1) {
            str = str + "1日に";
        } else if (period == 7) {
            str = str + "1週間に";
        } else if (period == 30) {
            str = str + "1か月に";
        } else if (period == 365) {
            str = str + "1年に";
        }
        str = str + count + "回";
        return str;
    }

    //######################################
    //引数からキャラクターのpng+gifを生成 ###
    //######################################
    function make_char_imgs(arr, dir) {
        var char_icon = arr.icon;
        var char_img = [];
        if (dir == "left") {
            char_img.push("imgs/" + char_icon + "/" + char_icon + "_left1.png");
            char_img.push("imgs/" + char_icon + "/" + char_icon + "_left2.png");
            return char_img;
        } else if (dir == "center") {
            char_img.push("imgs/" + char_icon + "/" + char_icon + "1.png");
            char_img.push("imgs/" + char_icon + "/" + char_icon + "1.gif");
            return char_img;
        } else if (dir == "right") {
            char_img.push("imgs/" + char_icon + "/" + char_icon + "_right1.png");
            char_img.push("imgs/" + char_icon + "/" + char_icon + "_right2.png");
            return char_img;
        } else {
            alert("error: can\'t make imgs_url");
        }
    }

    //######################################
    //引数からカテゴリーの名前を生成 ########
    //######################################
    function return_category_name(category_num) {
        if (category_num == 0) {
            return "身体";
        } else if (category_num == 1) {
            return "感覚";
        } else if (category_num == 2) {
            return "対人関係";
        } else if (category_num == 3) {
            return "学び/精神";
        }
    }

    //######################################
    //選択された生活指標カテゴリー以外のカテゴリーのチェックボックスのチェックを外す
    //######################################
    function checkbox_select(category_num) {
        if (category_num == 0) {
            $(".checkbox_mind").prop("checked", false);
            $(".checkbox_sociality").prop("checked", false);
            $(".checkbox_expression").prop("checked", false);
        } else if (category_num == 1) {
            $(".checkbox_health").prop("checked", false);
            $(".checkbox_sociality").prop("checked", false);
            $(".checkbox_expression").prop("checked", false);
        } else if (category_num == 2) {
            $(".checkbox_health").prop("checked", false);
            $(".checkbox_mind").prop("checked", false);
            $(".checkbox_expression").prop("checked", false);
        } else if (category_num == 3) {
            $(".checkbox_health").prop("checked", false);
            $(".checkbox_mind").prop("checked", false);
            $(".checkbox_sociality").prop("checked", false);
        } else if (category_num == 4) {
            //4が代入されたときは全部消す
            $(".checkbox_health").prop("checked", false);
            $(".checkbox_mind").prop("checked", false);
            $(".checkbox_sociality").prop("checked", false);
            $(".checkbox_expression").prop("checked", false);
        }
    }

});