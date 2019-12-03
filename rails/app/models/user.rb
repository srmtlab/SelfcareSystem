class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  has_many :avators, dependent: :destroy
  has_many :routines, dependent: :destroy
  has_many :schedules, dependent: :destroy

  enum gender: { man: 0, woman: 1 }
end
