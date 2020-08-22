<template>
  <v-row>
    <v-card color='grey lighten-4' width='100%' min-width='280px' height='400px' class='pa-2 mb-2'>
      <span class='inset-text' :style='["lg", "xl"].includes(this.$vuetify.breakpoint.name) ? "font-size:200px" : "font-size:150px"'>{{ value }}</span>
      <v-avatar v-for="(token, index) in tokenList" :key='`token-${index}`' :color="token ? 'white' : 'black'" class='ma-1 elevation-4'>
        <span class="display-1" v-if='token'>+</span>
        <span class="display-1 white--text" v-else>–</span>
      </v-avatar>
      <v-card color='error' class='white--text pa-2' style='position:absolute;right:5px;bottom:5px' v-if='locked'>
        <v-icon color='white' medium>lock</v-icon>
      </v-card>
      <span></span>
    </v-card>
    <v-row style='display:flex;justify-content:space-around'>
      <v-btn @click='addWhite' :disabled='tokenList.length >= 20 || locked'>
        Jeton <v-icon right>add_circle_outline</v-icon>
      </v-btn>
      <v-btn @click='addBlack' :disabled='tokenList.length >= 20 || locked'>
        Jeton <v-icon right>remove_circle</v-icon>
      </v-btn>
      <v-btn @click='clear' color='error' outlined :disabled='locked'>
        clear <v-icon right>clear</v-icon>
      </v-btn>
    </v-row>
  </v-row>
</template>

<script>
  export default {
    name: 'tokenPanel',
    props: { index: Number },
    data: () => ({
      tokenList: [],
      locked: false
    }),
    computed: {
      value(){
        if(this.tokenList.length == 0) return 0;
        let value = this.tokenList.reduce((total, num) => {
          let adding = num ? 1 : -1;
          return total + adding
        }, 0);
        return value > 0 ? `+${value}` : value;
      }
    },
    mounted(){
      this.eventBus.$on('startChallenge', nb => {
        switch(nb%2){
          case 0:
          if(this.index == 0){
            this.randomTokens();
          } else {
            this.tokenList = [];
          }
          break;
          case 1:
            this.randomTokens();
          break;
        }
      });
      this.eventBus.$on('endChallenge', () => {
        this.locked = false;
      });
    },
    methods: {
      addWhite(){
        if(this.tokenList.length < 25){
          this.tokenList.push(true);
          this.eventBus.$emit('emitTerm', {val: this.value, index: this.index});
        }
      },
      addBlack(){
        if(this.tokenList.length < 25){
          this.tokenList.push(false);
          this.eventBus.$emit('emitTerm', {val: this.value, index: this.index});
        }
      },
      clear(){
        this.tokenList = [];
        this.eventBus.$emit('emitTerm', {val: this.value, index: this.index});
      },
      randomTokens(){
        let tokenValue = Math.random() < 0.5;
        let nbTokens = Math.floor(Math.random()*16);
        this.tokenList = [];
        for(let i=0; i<nbTokens ; i++){
          this.tokenList.push(tokenValue);
        }
        this.locked = true;
        this.eventBus.$emit('emitTerm', {val: this.value, index: this.index});
      }
    }
  }
</script>

<style scoped>
.inset-text {
    /* Shadows are visible under slightly transparent text color */
    position:absolute;
    top:0;
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;

    color: rgba(240,240,240, 0.6);
    text-shadow: 1px 4px 6px #eee, 0 0 0 #333, 1px 4px 6px #eee;
}
</style>
