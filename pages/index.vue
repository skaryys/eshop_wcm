<template>
  <Container class="mainpage">
      <Heading1>
        E-shop Web Content Miner
      </Heading1>
      <Paragraph>
        Tento nástroj byl vytvořen v rámci semetrální práce v předmětu 4IZ470 - Dolování znalostí z webu.<br><br>
        Jeho úkolem je po zadání URL adresy produktu na libovolném e-shopu získat data o daném produktu ve formátu JSON. Nástroj získá název produktu
        popis produktu, URL adresu obrázku, cenu produktu a výrobce produktu.
      </Paragraph>
      <Row>
        <Col xs="5" sm="default" class="input-col">
          <input class="c-input main-input" id="url_input" />
        </Col>
        <Col xs="7" sm="stretch">
          <button class="c-button" v-on:click="getData()">
            Získat data
          </button>
        </Col>
      </Row>
<textarea class="c-input textarea" id="js-code-textarea">
{{ data }}
</textarea>
    <button class="c-button" v-on:click="copyData()">Zkopírovat data</button>
    <Loader v-if="loader"/>
  </Container>
</template>

<style scoped lang="scss">
  .mainpage {
    padding-top: 2rem;
    padding-bottom: 8rem;
  }

  .input-col {
    flex: 1 0 auto;

    @include break($screen-xs) {
      max-width: 100%;
    }
  }

  .textarea {
    height: 24rem;
    padding: 2rem 2.5rem;
    color: $black;
    margin-top: 2rem;
  }
</style>

<script>
  import axios from "axios";

  export default {
    asyncData() {
      return {
        data: {},
        loader: false
      }
    },
    methods: {
      copyData: function() {
        this.$el.querySelector("#js-code-textarea").select();
        document.execCommand("copy");
      },
      getData: function() {
        const self = this;
        self.loader = true;
        const query = this.$el.querySelector("#url_input").value;

        axios.get('/mine', {
          params: {
            'query': query
          }
        }).then(function (response) {
          self.data = response.data;
          self.loader = false;
        });
      }
    }
  }
</script>
