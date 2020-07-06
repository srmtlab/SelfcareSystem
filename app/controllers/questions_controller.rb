class QuestionsController < ApplicationController
    protect_from_forgery except: :show # searchアクションを除外
    def Question
    end
    def show
        render :text => "OK"
    end
end
