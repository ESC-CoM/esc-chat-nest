while read -r LINE; do
  if [[ $LINE == *'='* ]] && [[ $LINE != '#'* ]]; then
    ENV_VAR="$(echo $LINE | envsubst)"
    export "${ENV_VAR?}" >> ~/.zshrc 2> /dev/null
    export "${ENV_VAR?}" >> ~/.profile 2> /dev/null
    export "${ENV_VAR?}" >> ~/.bashrc 2> /dev/null
  fi
done < ./.env
npm i -g @nestjs/cli
yarn install
nest build
