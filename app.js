const BACKEND_ROOT = 'https://smash-upset-distance.ew.r.appspot.com/'

const SearchPage = Vue.component('search-page', {
  data () {
    return {
      search_term: null,
      loading: false,
      error: null,
      players: null,
      no_results: false,
    }
  },
  methods: {
    fetchData: _.debounce(function(e) {
      this.error = null
      this.loading = true
      this.no_results = false
      const fetchedTerm = this.search_term
      if (fetchedTerm) {
        // GET request using fetch with error handling
        fetch(BACKEND_ROOT + "upsets/players/search/?term=" + fetchedTerm)
          .then(async response => {
            const data = await response.json();
            this.loading = false
            // check for error response
            if (!response.ok) {
              const error = data
              return Promise.reject(error)
            } else {
              if (data.length == 0) {
                this.no_results = true
                this.players = null
              } else {
                this.players = data
              }
            }
          })
          .catch(error => {
            this.loading = false
            this.error = error.toString()
            console.error("There was an error!", error);
          });
      } else {
        this.loading = false
        this.players = null
      }
    }, 150)
  },
  template: '#search-page-template',
  mounted ()  {
    this.$refs.input.focus();
  }
})

const PathPage = Vue.component('path-page', {
  data () {
    return {
      loading: true,
      path: null,
      error: null,
      not_found: false,
      no_path: false
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      if (this.ismkleo) {
        this.loading = false
      } else {
        this.error = this.path = null
        this.not_found = false
        this.loading = true
        this.no_path = false
        const fetchedId = this.$route.params.id

        // GET request using fetch with error handling
        fetch(BACKEND_ROOT + "upsets/playerpath/" + fetchedId)
          .then(async response => {
            const data = await response.json();
            this.loading = false
            // make sure this request is the last one we did, discard otherwise
            if (this.$route.params.id !== fetchedId) return
            // check for error response
            if (response.status == 404){
              this.not_found = true
            } else if (!response.ok) {
              const error = data
              return Promise.reject(error)
            } else {
              if (data.path_exist){
                this.path = data.path
              } else {
                this.no_path = true
              }
            }
          })
          .catch(error => {
            this.loading = false
            this.error = error.toString()
            console.error("There was an error!", error);
          });
      }
    }
  },
  computed: {
    ismkleo () {
      return (this.$route.params.id == 222927)
    }
  },
  template: '#path-page-template'
})


const PlayerBox = Vue.component('player-box', {
  data () {
    return {
      loading: true,
      twittertag: null,
    }
  },
  props: ['id', 'tag', 'maincharacter'],
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  methods: {
    fetchData () {
      // GET request using fetch with error handling
      fetch(BACKEND_ROOT + "upsets/twittertag/player/" + this.id)
        .then(async response => {
          const data = await response.json();
          this.loading = false
          // check for error response
          if (!response.ok) {
            const error = data
            return Promise.reject(error)
          } else {
            this.twittertag = data.twitter_tag
          }
        })
        .catch(error => {
          console.error("There was an error!", error);
        });

    }
  },
  template: '#player-box-template'
})

const AboutPage = Vue.component('about-page', {
  template: '#about-page-template'
})

const CreditsPage = Vue.component('credits-page', {
  template: '#credits-page-template'
})

const Loader = Vue.component('loader', {
  props: {
    showtext: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  template: '#loader-template'
})

const router = new VueRouter({
  routes: [
    { path: '/', component: SearchPage },
    { path: '/path/:id', component: PathPage },
    { path: '/about', component: AboutPage },
    { path: '/credits', component: CreditsPage },
  ]
})


const app = new Vue({
  router: router,
  data: {
    product: 'Socks',
    description: 'A pair of warm fuzzy socks'
  }
}).$mount('#app')