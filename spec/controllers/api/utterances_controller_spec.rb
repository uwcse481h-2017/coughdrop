require 'spec_helper'

describe Api::UtterancesController, :type => :controller do
  describe "POST create" do
    it "should require api token" do
      post :create, :utterance => {}
      assert_missing_token
    end
    
    it "should generate a valid utterance" do
      token_user
      post :create, :utterance => {:button_list => [{label: "ok"}], :sentence => "ok"}
      expect(response).to be_success
      u = Utterance.last
      expect(u).not_to eq(nil)
      expect(u.data['button_list']).to eq([{'label' => 'ok'}])
      expect(u.data['sentence']).to eq('ok')
    end
    
    it "should return a json response" do
      token_user
      post :create, :utterance => {:button_list => [{label: "ok"}], :sentence => "ok"}
      expect(response).to be_success
      json = JSON.parse(response.body)
      expect(json['utterance']['id']).not_to eq(nil)
      expect(json['utterance']['link']).not_to eq(nil)
      expect(json['utterance']['button_list']).not_to eq(nil)
      expect(json['utterance']['sentence']).not_to eq(nil)
      expect(json['utterance']['image_url']).not_to eq(nil)
    end
    
    it "should error gracefully on utterance create fail" do
      token_user
      expect_any_instance_of(Utterance).to receive(:process_params){|u| u.add_processing_error("bacon") }.and_return(false)
      post :create, :utterance => {:button_list => [{label: "ok"}], :sentence => "ok"}
      expect(response).not_to be_success
      json = JSON.parse(response.body)
      expect(json['error']).to eq("utterance creation failed")
      expect(json['errors']).to eq(["bacon"])
    end
  end
  
  describe "PUT update" do
    it "should require api token" do
      put :update, :id => '1234', :utterance => {}
      assert_missing_token
    end
    
    it "should update an utterance" do
      token_user
      utterance = Utterance.create(:user => @user)
      put :update, :id => utterance.global_id, :utterance => {:show_user => true, :image_url => "http://www.pic.com/pic.png"}
      expect(response).to be_success
      u = Utterance.last
      expect(u).not_to eq(nil)
      expect(u.data['show_user']).to eq(true)
      expect(u.data['image_url']).to eq("http://www.pic.com/pic.png")
    end
    
    it "should return a json response" do
      token_user
      utterance = Utterance.create(:user => @user)
      put :update, :id => utterance.global_id, :utterance => {:show_user => true, :sentence => "ok"}
      expect(response).to be_success
      json = JSON.parse(response.body)
      expect(json['utterance']['id']).not_to eq(nil)
      expect(json['utterance']['link']).not_to eq(nil)
      expect(json['utterance']['button_list']).to eq(nil)
      expect(json['utterance']['sentence']).to eq("ok")
      expect(json['utterance']['show_user']).to eq(true)
      expect(json['utterance']['permissions']).to eq({'view' => true, 'edit' => true, 'user_id' => @user.global_id})
      expect(json['utterance']['user']['id']).to eq(@user.global_id)
      expect(json['utterance']['user']['user_name']).to eq(@user.user_name)
      expect(json['utterance']['image_url']).not_to eq(nil)
    end
    
    it "should error gracefully on utterance create fail" do
      token_user
      utterance = Utterance.create(:user => @user)
      expect_any_instance_of(Utterance).to receive(:process_params){|u| u.add_processing_error("bacon") }.and_return(false)
      put :update, :id => utterance.global_id, :utterance => {:button_list => [{label: "ok"}], :sentence => "ok"}
      expect(response).not_to be_success
      json = JSON.parse(response.body)
      expect(json['error']).to eq("utterance update failed")
      expect(json['errors']).to eq(["bacon"])
    end
  end
  
  describe "GET show" do
    it "should not require api token" do
      u = Utterance.create(:data => {:button_list => [{label: 'ok'}], :sentence => 'ok'})
      get :show, :id => u.global_id
      expect(response).to be_success
    end
    
    it "should error gracefully if not found" do
      get :show, :id => "abc"
      assert_not_found
    end
    
    it "should return a json response" do
      u = Utterance.create(:data => {:button_list => [{label: 'ok'}], :sentence => 'ok'})
      get :show, :id => u.global_id
      expect(response).to be_success
      json = JSON.parse(response.body)
      expect(json['utterance']['id']).not_to eq(nil)
      expect(json['utterance']['link']).not_to eq(nil)
      expect(json['utterance']['button_list']).not_to eq(nil)
      expect(json['utterance']['sentence']).not_to eq(nil)
      expect(json['utterance']['image_url']).not_to eq(nil)
      expect(json['utterance']['user']).to eq(nil)
      expect(json['utterance']['permissions']).to eq(nil)
    end
  end
end
