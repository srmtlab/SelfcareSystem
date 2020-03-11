Rails.application.routes.draw do

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root "home#index"
  get "plaza", to: 'home#plaza'
  post "plaza/routines", to: "home#routines"
  post "plaza/routines_test1", to: "home#routines_test1"
  post "plaza/routines_test2_1", to: "home#routines_test2_1"
  post "plaza/routines_test2_2", to: "home#routines_test2_2"
  post "plaza/routines_new", to: "home#routines_new"
  # get '/', to: 'home#index'

  devise_for :users, :controllers => {
    :registrations => 'users/registrations',
    :sessions => 'users/sessions'   
  } 
  get 'question', to: 'home#Question'
  post "question/register", to: "home#register"
  post "question/addCache", to: "home#addCache"
  post "question/addRoutines", to: "home#addRoutines"
  
end
