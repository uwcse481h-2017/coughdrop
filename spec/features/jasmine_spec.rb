# describe 'Jasmine suite', :js do
#   def run_jasmine_tests
#     visit '/jasmine'
#     Timeout.timeout(10) do
#       while page.has_css?('.runningAlert')
#         sleep 0.25
#       end
#     end
#   end
#  
#   it "passes" do
#     run_jasmine_tests
#  
#     if page.has_css?(".failingAlert")
#       messages = []
#       all('.specDetail.failed .description').each_with_index do |spec, index|
#         messages << "#{index + 1}. #{spec.text}"
#       end
#       messages.unshift("Jasmine suite failed with #{messages.size} failures")
#       fail messages.join("\n")
#     else
#       page.should have_css('.passingAlert')
#     end
#   end
# end