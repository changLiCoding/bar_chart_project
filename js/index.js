const setLocalstorage = ( data ) =>
{
  localStorage.setItem( 'cityReport', JSON.stringify( data ) )
};

const getLocalstorage = () =>
{
  let temp = localStorage.getItem( 'cityReport' );
  return JSON.parse( temp )
}

const updateInfoList = ( arr ) =>
{
  $.each( arr, function ( index, ele )
  {
    let countryName = ele.country;
    let population = ele.population;
    let newLi = `<li class="list-group-item">
					<span class="country">Country: ${ countryName }</span>
					<span>Population: ${ population } Million</span>
					<button class="delete-btn"><i class="fas fa-trash"></i></button>
				</li>`
    $( ".list-group" ).append( newLi ).children().css( 'text-transform', 'capitalize' ).css( 'display', 'none' ).stop().slideDown();
  } )
}

const countryDataFetch = async ( countryName ) =>
{
  const res = await fetch( `https://api.api-ninjas.com/v1/country?name=${ countryName }`,
    {
      method: 'GET',
      headers: {
        'X-Api-Key': '0EUmzfaUWJ64vz4e+sgB5w==BTGaO7TJKKjRlFP8'
      }
    } );
  const data = await res.json();
  for ( let i = 0; i < cityArr.length; i++ )
  {
    console.log( cityArr[ i ][ "population" ], data[ 0 ].population )
    if ( cityArr[ i ][ "population" ] === data[ 0 ].population )
    {
      cityArr.splice( i, 1 );
    }

  }
  cityArr.push( { "country": countryName, "population": data[ 0 ].population } )
  setLocalstorage( cityArr )
  updateInfoList( [ cityArr[ cityArr.length - 1 ] ] )
}

// Capitlize first letter of strings
function titleCase ( str )
{
  newStr = str.slice( 0, 1 ).toUpperCase() + str.slice( 1 ).toLowerCase();
  return newStr;
}


let cityArr;

// localStorage.removeItem( 'cityReport' )
if ( getLocalstorage() === null )
{
  cityArr = new Array();
}
else
{
  cityArr = getLocalstorage();
}

updateInfoList( cityArr );




( function ()
{
  $( "a.search_icon" ).on( "click", function ()
  {
    if ( $( ".search_input" ).val().length > 0 )
    {
      let inputValue = $( ".search_input" ).val();
      $( ".search_input" ).val( "" );
      countryDataFetch( inputValue )
    }
  } )
} )();

( function ()
{
  $( 'ul.list-group' ).on( 'click', '.delete-btn', function ()
  {
    let deleteMessage = ( $( this ).siblings( '.country' ).text() ).substring( 9 );
    $.each( cityArr, function ( index, ele )
    {
      console.log( ele.country, deleteMessage, cityArr );
      if ( ele.country === deleteMessage )
      {
        cityArr.splice( index, 1 );
        console.log( cityArr )
        setLocalstorage( cityArr );
        return false
      }
    } )
    $( this ).parent().stop().slideUp( function ()
    {
      $( this ).remove();
    } );
  } )
} )();


let option;
let myChart;

( function ()
{
  $( ".btn-warning" ).on( 'click', function ()
  {
    option = {
      title: {
        left: 'center',
        text: 'Population in Different Countries',
        subtext: 'In Millions',
        subtextStyle: {
          color: '#fff',
        },
        textStyle: {
          color: '#fff',
        }
      },
      tooltip: {},
      grid: {
        height: 370,
        width: 690,
        top: 70,
        bottom: 60,
      },
      xAxis: {
        name: 'Countries',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        type: 'category',
        data: []
      },
      yAxis: {
        name: 'Population in Millions',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        type: 'value'
      },
      series: [
        {
          data: [],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    };
    $( '.chart-container' ).removeAttr( '_echarts_instance_' ).children().remove();
    let myChart = echarts.init( document.querySelector( '.chart-container' ) );
    $.each( cityArr, function ( index, ele )
    {
      let pushedStr = titleCase( ele.country )
      option.xAxis.data.push( pushedStr );
      option.series[ 0 ].data.push( ele.population );
    } )
    myChart.setOption( option );
    myChart.dispose;
  } )

} )();
