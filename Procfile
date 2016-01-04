web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
resque: env QUEUE=* TERM_CHILD=1 bundle exec rake environment resque:work
ember: sh -c 'cd ./app/frontend/ && ember server'
