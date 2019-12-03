class HomeController < ApplicationController
    def index
    end

    def plaza
        # DBにある生活指標の中からランダムに1個抽出
        routine_num = Routine.count
        routine_selected = rand(routine_num) + 1
        @routine = Routine.find(routine_selected)

        # （例
        # 最も頻度（count）が高い指標を持つユーザ
        # @routine = current_user.routines.order("count DESC").first
        # 
        # current_user:現在ログインしているユーザ
    end
end
