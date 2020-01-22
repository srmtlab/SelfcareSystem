class HomeController < ApplicationController

    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    # 記録画面の挙動
    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    def index
    end

    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    # 広場画面の挙動
    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    def plaza
        # 引き出す指標のカテゴリーを選択(被験者実験用)
        # categories = [0, 1, 2, 3] # 数字はそれぞれhealth, mind, sociality, self_expressionに対応

        # 第2評価実験用 今後一生使わない
        template_file = 0
        categories = []
        categories_0 = [1, 2]
        categories_1 = [1, 3]
        categories_2 = [2, 3]
        categories_3 = [1, 3]
        categories_4 = [2, 1]
        categories_5 = [3, 1]
        categories_6 = [3, 2]
        categories_7 = [3, 1]

        if (current_user.id % 8) < 4 then
            if (current_user.id % 4) == 0 then
                categories.push(categories_0[0])
                categories.push(categories_0[1])
            elsif (current_user.id % 4) == 1 then
                categories.push(categories_1[0])
                categories.push(categories_1[1])
            elsif (current_user.id % 4) == 2 then
                categories.push(categories_2[0])
                categories.push(categories_2[1])
            elsif (current_user.id % 4) == 3 then
                categories.push(categories_3[0])
                categories.push(categories_3[1])
            end
            template_file = 0
        elsif (current_user.id % 8) >= 4 then
            if (current_user.id % 4) == 0 then
                categories.push(categories_4[0])
                categories.push(categories_4[1])
            elsif (current_user.id % 4) == 1 then
                categories.push(categories_5[0])
                categories.push(categories_5[1])
            elsif (current_user.id % 4) == 2 then
                categories.push(categories_6[0])
                categories.push(categories_6[1])
            elsif (current_user.id % 4) == 3 then
                categories.push(categories_7[0])
                categories.push(categories_7[1])
            end
            template_file = 1
        end
        
        @template_file = template_file
        category_first = categories[0]
        category_second = categories[1]
        @category_first = category_first
        @category_second = category_second
        # 広場画面を参考にする生活指標カテゴリーを持つ生活指標を全て取り出す
        routines = Category.all[category_second].routines.all
        
        selected_routines = []
        i = 0
        text_flag = true
        while i < routines.count do
            routine_i = routines[i]
            j = 0
            for routine in routines do
                if j != i then
                    if routine_i.text == routine.text then
                        if i > j then
                            text_flag = false
                        end
                    end
                end
                j += 1
            end
            if text_flag == true then
                if routine_i.publish == "permission" then
                    if routine_i.user != current_user then
                        selected_routines.push(routine_i)
                    end
                end
            end
            i += 1
        end
        @selected_routines = selected_routines
        
        # ログインユーザの生活指標とそのカテゴリー情報
        user_routines = current_user.routines
        @user_routines = user_routines
        user_categories = []
        for routine in user_routines do
            i = 0
            user_category = []
            while i < routine.routine_categories.count do
                if routine.routine_categories[i].category.name == "health" then
                    user_category.push(0)
                elsif routine.routine_categories[i].category.name == "mind" then
                    user_category.push(1)
                elsif routine.routine_categories[i].category.name == "sociality" then
                    user_category.push(2)
                elsif routine.routine_categories[i].category.name == "self_expression" then
                    user_category.push(3)
                end
                i += 1
            end
            user_categories.push(user_category)
        end
        @user_categories = user_categories

=begin

        # １．被験者実験で使った検索プログラムにpublishの管理を追加
        selected_routines = []
        i = 0
        while i < routines.count do
            if routines[i].publish == "permission" then
                if routines[i].user != current_user then
                    selected_routines.push(routines[i])
                end
            end
            i += 1
        end
        @selected_routines = selected_routines

        # ２．被験者実験で使った検索プログラムにpublishの管理と同名生活指標を選択しないプログラムを追加
        # 引き出す指標のカテゴリーを選択(被験者実験用)
        categories = [0, 1, 2, 3] # 数字はそれぞれhealth, mind, sociality, self_expressionに対応
        while categories.length > 2 do
            categories.delete_at(rand(categories.length) + 1)
        end
        # 広場画面を参考にする生活指標カテゴリー
        selected_category_index = rand(2)
        category_second = categories[selected_category_index]
        @category_second = category_second
        # 広場画面を参考にしない生活指標カテゴリー
        categories.delete_at(selected_category_index)
        category_first = categories[0]
        @category_first = category_first


        # ３．本番用プログラム
        user_num = User.count
        selected_routines = []
        selected_categories = []
        selected_avators = []

        # 引き出す指標のカテゴリー候補，頻度候補を選択(本番用)
        candidated_categories = []
        candidated_period = []
        category_count = [0, 0, 0, 0]
        period_count = [0, 0, 0, 0]
        current_routines = current_user.routines
        for routine in current_routines do
            period = routine.period
            categories = routine.categories
            if period == 1 then
                period_count[0] += 1
            elsif period == 7 then
                period_count[1] += 1
            elsif period == 30 then
                period_count[2] += 1
            elsif period == 365 then
                period_count[3] += 1
            end
            for category in categories do
                if category.name == "health" then
                    category_count[0] += 1
                elsif category.name == "mind" then
                    category_count[1] += 1
                elsif category.name == "sociality" then
                    category_count[2] += 1
                elsif category.name == "self_expression" then
                    category_count[3] += 1
                end
            end
        end
        category_index = category_count.each_index.select{|i|category_count[i] == category_count.min}
        period_index = period_count.each_index.select{|i|period_count[i] == period_count.min}
        if category_index.length > 3 then
            category_index.delete_at(rand(category_index.length) + 1)
        end
        if period_index.length > 3 then
            period_index.delete_at(rand(period_index.length) + 1)
        end
        for category_i in category_index do
            if category_i == 0 then
                candidated_categories.push("health")
            elsif category_i == 1 then
                candidated_categories.push("mind")
            elsif category_i == 2 then
                candidated_categories.push("sociality")
            elsif category_i == 3 then
                candidated_categories.push("self_expression")
            end
        end
        for period_i in period_index do
            if period_i == 0 then
                candidated_period.push(1)
            elsif period_i == 1 then
                candidated_period.push(7)
            elsif period_i == 2 then
                candidated_period.push(30)
            elsif period_i == 3 then
                candidated_period.push(365)
            end
        end

        # TODO: 指標を３つ取り出すプログラムを作る
        # 条件を満たす3つのルーティーンを見つける
        while selected_routines.length < 3 do
            # selected_user: ランダムに選択された表示ユーザ候補
            selected_user = User.all[rand(user_num)]
            if selected_user != current_user then
                if selected_routines.length > 0 then
                    selected_count = 0
                    for s_routine in selected_routines do
                        if s_routine.user != selected_user then
                            selected_count += 1
                        else
                            break
                        end
                    end
                    if selected_count == selected_routines.length then
                        selected_routine = selected_user.routines[rand(selected_user.routines.count)]
                        selected_routines.push(selected_routine)
                    end
                else
                    selected_routine = selected_user.routines[rand(selected_user.routines.count)]
                    selected_routines.push(selected_routine)
                end
            end
        end

        for routine in selected_routines do
            categories = []
            routine_categories_num = routine.routine_categories.count
            for i in 0..(routine_categories_num-1) do
                categories.push(routine.routine_categories[i].category.name)
            end
            selected_categories.push(categories)
            selected_avators.push(routine.user.avators[0])
        end
        @routines_selected = selected_routines
        @categories_selected = selected_categories
        @avators_selected = selected_avators
=end

        
    end

    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    # 広場画面で入力されたルーティーンをデータベースに登録する
    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    def routines
        i_category = 0
        category_box = []
        for category in params[:categories] do
            if category == "true" then
                category_box.push(Category.all[i_category])
            end
            i_category += 1
        end

        cache_find = Cache.select("id, label, wd_type").find_by(label: params[:routine_text])
        if !cache_find then
            cache = Cache.new(
                label: params[:routine_text]
            )
            cache.save
            cache_find = Cache.select("id, label, wd_type").find_by(label: params[:routine_text])
        end
        routine = Routine.new(
            user_id: current_user.id,
            text: params[:routine_text],
            period: params[:routine_period],
            count: params[:routine_count],
            categories: category_box,
            cache: cache_find
        )
        if routine.save then
            render :json => {"who": -1, "talk": "生活指標を登録したよ。<br>教えてくれてありがとう。"} 
        end

        
        # 参考
        # routine = Routine.find(user_id: current_user, text: "味噌汁")
        # routine.text = "aaaaa"
        # routine.save
    end

    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    # 広場画面で入力されたルーティーンをデータベースに登録する(評価実験1用)
    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    def routines_test1
        i_category = 0
        category_box = []
        category_index = []
        for category in params[:categories] do
            if category == "true" then
                category_box.push(Category.all[i_category])
                category_index.push(i_category.to_s)
            end
            i_category += 1
        end

        i_categories = 0
        categories_index = ""
        for index in category_index do
            if i_categories < category_index.length - 1 then
                categories_index = categories_index + index + ","
            elsif i_categories == category_index.length - 1 then
                categories_index = categories_index + index
            end
            i_categories += 1
        end

        cache_find = Cache.select("id, label, wd_type").find_by(label: params[:routine_text])
        if !cache_find then
            cache = Cache.new(
                label: params[:routine_text]
            )
            cache.save
            cache_find = Cache.select("id, label, wd_type").find_by(label: params[:routine_text])
        end
        routine = Routine.new(
            user_id: current_user.id,
            text: params[:routine_text],
            period: params[:routine_period],
            count: params[:routine_count],
            categories: category_box,
            cache: cache_find
        )
        if routine.save then
            f = File.open('log2.txt', 'a')
            f.puts("(" + current_user.name + ",1)," + params[:referenced_category].to_s + "=>" + params[:routine_text] + "," + categories_index)
            f.close
            render :json => {"who": -1, "talk": "生活指標を登録したよ。<br>教えてくれてありがとう。"} 
        end
    end

    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    # 広場画面で入力されたルーティーンをデータベースに登録する(評価実験2用)
    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    def routines_test2_1
        i_category = 0
        category_box = []
        category_index = []
        for category in params[:categories] do
            if category == "true" then
                category_box.push(Category.all[i_category])
                category_index.push(i_category.to_s)
            end
            i_category += 1
        end

        i_categories = 0
        categories_index = ""
        for index in category_index do
            if i_categories < category_index.length - 1 then
                categories_index = categories_index + index + ","
            elsif i_categories == category_index.length - 1 then
                categories_index = categories_index + index
            end
            i_categories += 1
        end

        cache_find = Cache.select("id, label, wd_type").find_by(label: params[:routine_text])
        if !cache_find then
            cache = Cache.new(
                label: params[:routine_text]
            )
            cache.save
            cache_find = Cache.select("id, label, wd_type").find_by(label: params[:routine_text])
        end
        routine = Routine.new(
            user_id: current_user.id,
            text: params[:routine_text],
            period: params[:routine_period],
            count: params[:routine_count],
            categories: category_box,
            cache: cache_find
        )
        if routine.save then
            f = File.open('log2.txt', 'a')
            f.puts("(" + current_user.name + ",2_1)," + params[:referenced_category].to_s + "=>" + params[:routine_text] + "," + categories_index)
            f.close
            render :json => {"who": -1, "talk": "生活指標を登録したよ。<br>教えてくれてありがとう。"} 
        end
    end

    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    # 広場画面で入力されたルーティーンをデータベースに登録する(評価実験2-plaza用)
    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    def routines_test2_2
        i_category = 0
        category_box = []
        category_index = []
        for category in params[:categories] do
            if category == "true" then
                category_box.push(Category.all[i_category])
                category_index.push(i_category.to_s)
            end
            i_category += 1
        end

        i_categories = 0
        categories_index = ""
        for index in category_index do
            if i_categories < category_index.length - 1 then
                categories_index = categories_index + index + ","
            elsif i_categories == category_index.length - 1 then
                categories_index = categories_index + index
            end
            i_categories += 1
        end

        cache_find = Cache.select("id, label, wd_type").find_by(label: params[:routine_text])
        if !cache_find then
            cache = Cache.new(
                label: params[:routine_text]
            )
            cache.save
            cache_find = Cache.select("id, label, wd_type").find_by(label: params[:routine_text])
        end
        routine = Routine.new(
            user_id: current_user.id,
            text: params[:routine_text],
            period: params[:routine_period],
            count: params[:routine_count],
            categories: category_box,
            cache: cache_find
        )
        if routine.save then
            f = File.open('log2.txt', 'a')
            f.puts("(" + current_user.name + ",2_2)" + params[:referenced_routine_text] + "," + params[:referenced_category].to_s + "=>" + params[:routine_text] + "," + categories_index)
            f.close
            render :json => {"who": -1, "talk": "生活指標を登録したよ。<br>教えてくれてありがとう。"} 
        end
    end

    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    # ???
    #%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    def routine_params
        # TODO strong paramsを参考にして書き換えたりとかする
        # 神谷先輩が書いた　何のためにあるのか分からない...
    end

    def register
        routine = Cache.select('id, label, wd_type').find_by(label: params['text'])
        if routine
            render :json => {id: routine.id, label: routine.label, wd_type: routine.wd_type}
        else
            render :json => {label: "ないよ", wd_type: "知らない"}
        end
    end

    def addCache
        cache = Cache.new(
            label: params['text'],
            wd_type: params['wd_type']
            )
        cache.save
    end

    def addRoutines
        cache = Cache.select('id, label, wd_type').find_by(label: params['text'])
        i_category = 0
        category_box = []
        for category in params['category'] do
            if category == "true" then
                category_box.push(Category.all[i_category])
            end
            i_category += 1
        end
        
        routines = Routine.new(
            user_id: current_user.id,
            text: params['text'],
            period: params['period'],
            count: params['count'],
            importance: params['importance'],
            cache: cache,
            categories: category_box)
        routines.save
    end
end

# routine_num = Routine.count
# routine_selected = rand(routine_num) + 1
# @routine1 = Routine.find(routine_selected)
# @routine2 = Routine.find(routine_selected).text()
# @user = User.all[0].name
# @routine_num_shimizu = User.all[0].routines[0].id

# 試したもの
# current_user : 現在ログインしているユーザのuserを参照
# 選択user.routines : 選択したユーザが持つroutineを参照
# current_user.routines.order("count DESC").first : 最も頻度（count）が高い指標を持つユーザ
# User.all[0].name : Userテーブルの中で一番idが小さいユーザの名前
# table名.count : 選択テーブルのデータ数
# table名.find(num) : 選択テーブルの中のidがnumのものを参照

# ・ファイル操作(txt)
#########################################
# f = File.open('sample.txt', 'w')
# f.puts("Hello world!")
# f.close
#########################################
# 上記のプログラムを実行するとrailsディレクトリ下にsample.txtが追加される。
# ・ファイル操作(csv)
#########################################
# require "csv"
# f = CSV.open('test.csv','w')
#   f.puts ["A","B","C"]
#   f.puts ["milk","coffee","water"]
# f.close
#########################################
# 上記のプログラムを実行するとrailsディレクトリ下にtest.csvが追加される。
# ・ファイル操作(int→str)
#########################################
# f = File.open('log.txt', 'a')
# f.puts("," + 0.to_s + "=>" + "夢" + "," + "0,1,2")
# f.close
#########################################
# 上記のプログラムを実行するとrailsディレクトリ下のlog.txtに文字列が追加される。