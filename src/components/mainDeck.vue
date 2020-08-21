<template>
  <v-container>
    <v-row>
      <v-col cols='9'>
        <v-row>
          <v-col cols='5' style='display:flex;justify-content:center;align-items:center;'>
            <tokenPanel :index='0'/>
          </v-col>
          <v-col cols='2' style='display:flex;justify-content:center;align-items:center;'>
            <v-hover v-slot:default="{ hover }">
              <v-card
                class='display-4 font-weight-bold'
                :elevation="hover ? 5 : 0"
                :color="hover ? 'white' : 'white'"
                height="80" width="80"
                style='display:flex;justify-content:center;align-items:center;cursor:pointer'
                @click='operation = !operation'
                >
                <span v-if='operation'>+</span>
                <span v-else>–</span>
              </v-card>
            </v-hover>
          </v-col>
          <v-col cols='5' style='display:flex;justify-content:center;align-items:center;'>
            <tokenPanel :index='1'/>
          </v-col>
        </v-row>
        <v-btn block color='primary' x-large class='mt-4' @click='moveLift'>
          Effectuer
        </v-btn>
      </v-col>
      <v-col cols='1'></v-col>
      <v-col cols='2' style='position:relative' class='py-0'>
          <v-card x-large color="primary" outlined class='display-1 font-weight-bold text-xs-center white--text' min-width='120px' max-width='120px'>
            <div style='width:100%;display:flex;justify-content:center'>
              {{ result | formatNb }}
            </div>
          </v-card>
        <v-img min-width='170px' max-width='170px' src="../assets/axe.png"></v-img>
        <v-img id='lift' class='smoothMove' min-width='75px' max-width='75px' src="../assets/lift.png" style='position:absolute;top:219px;left:34px'></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import tokenPanel from './tokenPanel';

  export default {
    name: 'mainDeck',
    components: {
      tokenPanel,
    },
    data: () => ({
      operation: true,
      terms: [0, 0],
      result: 0,
    }),
    mounted(){
      this.eventBus.$on('emitTerm', data => {
        this.terms[data.index] = data.val;
      });
    },
    filters:{
      formatNb(nb){
        if(nb == 0) return 0;
        if(nb > 0) return `+${nb}`;
        return `–${-nb}`
      }
    },
    methods: {
      moveLift(){
        let result = this.operation ? parseInt(this.terms[0])+parseInt(this.terms[1]) : parseInt(this.terms[0])-parseInt(this.terms[1]);
        document.getElementById("lift").style.transform = `translateY(${-result*12}px)`;
        if(this.result != result){
          let count = setInterval(()=> {
            this.result += Math.sign(result-this.result);
            if(this.result == result) clearInterval(count);
          }, 500/Math.abs(result-this.result));
        }
      }
    }
  }
</script>

<style scoped>
.smoothMove {
  transition: all .5s
}
</style>
