Rails.application.routes.draw do

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root "home#index"
  get "plaza", to: 'home#plaza'
  post "plaza/routines", to: "home#routines"
  # get '/', to: 'home#index'

  devise_for :users, :controllers => {
    :registrations => 'users/registrations',
    :sessions => 'users/sessions'   
  } 
  get 'question', to: 'home#Question'
  post "question/register", to: "home#register"
end
