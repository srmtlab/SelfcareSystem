class HomeController < ApplicationController
    def index
        cur_user = User.all[0] # user:shimizu
        cur_user_routines = cur_user.routines # shimizuのroutine全て
        @cur_user_routine1 = cur_user_routines[0].text
        @cur_user_routine2 = cur_user_routines[1].text

        routine_num = Routine.count # 全routineの数
        i = 0
        check = [false]
        while check.include?(false) do
            i = 0
            check = []
            left_routine = Routine.all[rand(routine_num)]
            for cur_user_routine in cur_user_routines do
                if cur_user_routine == left_routine then
                    check[i] = false
                else
                    check[i] = true
                end
                i += 1
            end
        end
        @routine_left = left_routine.text

    end

    def plaza

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