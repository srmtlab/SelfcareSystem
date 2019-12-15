class HomeController < ApplicationController
    def index
        user = User.all[5]
        routine = user.routines[0]
        @category = routine.routine_categories[0].category
    end

    def plaza
        user_num = User.count
        selected_routines = []

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
                        selected_routines.push(selected_user.routines[rand(selected_user.routines.count)])
                    end
                else
                    selected_routines.push(selected_user.routines[rand(selected_user.routines.count)])
                end
            end
        end
        @routines_selected = selected_routines
        
    end

    def routines
        routine = Routine.new(
            user_id: current_user.id,
            text: params['text']
            )

        
        # TODO: 参考
        # routine = Routine.find(user_id: current_user, text: "味噌汁")
        # routine.text = "aaaaa"
        # routine.save

        routine.importance = 2

        if routine.save
            # もし保存が成功したならば
            render :json => {text: routine.text, user_name: current_user.name} 
        end
    end

    def routine_params
        # TODO: strong paramsを参考にして書き換えたりとかする
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