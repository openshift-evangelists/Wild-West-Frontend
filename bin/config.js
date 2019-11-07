var multipaas   = require('config-multipaas');
var autoconfig  = function (){

  // Autodetect Linked Components
  var backend_component= undefined,
      backend_component_url= undefined,
      backend_component_name= process.env.BACKEND_COMPONENT_NAME,
      backend_path = process.env.BACKEND_PATH || "/ws",
      no_slash_frontend = undefined,
      frontend_path = process.env.URL_PREFIX || "/",
      components = multipaas.components,
      component  = multipaas.component

  //Normalize path inputs
  if( process.env.URL_PREFIX ){
    if( frontend_path !== '/' ){
      //The frontend path must end with a slash
      if( frontend_path.substring(frontend_path.length - 1) !== "/") {
        frontend_path += "/";
      }
      no_slash_frontend = frontend_path.slice(0,frontend_path.length-1);
    }
    if( !process.env.BACKEND_PATH ){
      backend_path = process.env.URL_PREFIX+"/ws";
    }
  }
  if( process.env.BACKEND_PATH ){
    //No trailing slash for the backend path
    if( backend_path.substring(backend_path.length - 1) == "/") {
      backend_path = backend_path.slice(0, backend_path.length-1);
    }
  }

  if( !components || components.length < 1){
    console.error("CONFIG ERROR: Can't find backend webservices component! \nUse `odo link` to link your front-end component to a backend component.")
  }else{
    if( process.env.hasOwnProperty('BACKEND_COMPONENT_NAME') && components.includes(backend_component_name.toUpperCase())){
      backend_component = backend_component_name.toUpperCase();
    }else{
      backend_component = components[0];
    }
    backend_component_url = component[backend_component].host+':'+component[backend_component].port
  }

  // Configure the BACKEND_SERVICE host address via environment variables,
  // OR, use `odo link backend` (where "backend" is the name of your backend component)
  // To select a specific component by name, set the "BACKEND_COMPONENT_NAME" env var:
  var backend_host = process.env.BACKEND_SERVICE || backend_component_url;
  var config = multipaas().add({
    'no_slash_frontend': no_slash_frontend,
    'frontend_path': frontend_path,
    'path_info': "Frontend available at URL_PREFIX: "+frontend_path,
    'components': components,
    'backend_component_name': backend_component_name,
    'backend_path': backend_path,
    'backend_component': backend_component,
    'backend_component_url': backend_component_url,
    'backend_host': backend_host,
    'backend_config_error': { 'Error': "Backend Component Not Configured" },
    'backend_config_info': "Proxying \""+backend_path+"/*\" to '"+backend_host+"'"
  });

  return config;
}

exports = module.exports = autoconfig();
