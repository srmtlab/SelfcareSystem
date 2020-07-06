class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  has_many :avators, dependent: :destroy
  has_many :routines, dependent: :destroy
  has_many :schedules, dependent: :destroy

  enum gender: { male: 0, female: 1 }

  def wd_gender
    if self.gender == "male" then
      "wd:Q6581097"
    else
      "wd:Q6581072"
    end
  end

end
