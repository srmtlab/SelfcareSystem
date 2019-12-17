class HomeController < ApplicationController
    def index
    end

    def plaza
        user_num = User.count
        selected_routines = []
        selected_categories = []
        selected_avators = []

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
        
    end

    def routines
        i_category = 0
        category_box = []
        for category in params[:categories] do
            if category == "true" then
                category_box.push(Category.all[i_category])
            end
            i_category += 1
        end
        routine = Routine.new(
            user_id: current_user.id,
            text: params[:routine_text],
            period: params[:routine_period],
            count: params[:routine_count],
            categories: category_box
        )
        if routine.save then
            render :json => {"who": -1, "talk": "生活指標を登録したよ。<br>教えてくれてありがとう。"} 
        end

        
        # 参考
        # routine = Routine.find(user_id: current_user, text: "味噌汁")
        # routine.text = "aaaaa"
        # routine.save
    end

    def routine_params
        # TODO strong paramsを参考にして書き換えたりとかする
        # 神谷先輩が書いた　何のためにあるのか分からない...
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