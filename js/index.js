
// declare function for renew or update locoalstorage
const setLocalstorage = ( data ) => {
  localStorage.setItem( 'cityReport', JSON.stringify( data ) );
};

// declare function for download localstorage to countryArr variable
const getLocalstorage = () => {
  let temp = localStorage.getItem( 'cityReport' );
  return JSON.parse( temp );
};

// declare function for iterating countryArr and update ul element
const updateInfoList = ( arr ) => {
  $.each( arr, function ( index, ele ) {
    // iterate countryArr and declare local scope variables to get data from countryArr
    let countryName = ele.country;
    let population = ele.population;
    // declare newLi variable to append into ul
    // contain button style from FontAwesome to delete the element in the future
    let newLi = `<li class="list-group-item">
    <span class="country">Country: ${ countryName }</span>
    <span>Population: ${ population } Million</span>
    <button class="delete-btn"><i class="fas fa-trash"></i></button>
    </li>`;
    // change all appended li with capitalized text
    // set display as none and slide the new appended li with animation
    $( ".list-group" ).append( newLi ).children().css( 'text-transform', 'capitalize' ).css( 'display', 'none' ).stop().slideDown();
  } );
};

let countryArr;
// declare function for data fetching and renew data list
const countryDataFetch = async ( countryName ) => {
  // async await for data
  const res = await fetch( `https://api.api-ninjas.com/v1/country?name=${ countryName }`,
    {
      method: 'GET',
      headers: {
        'X-Api-Key': '0EUmzfaUWJ64vz4e+sgB5w==BTGaO7TJKKjRlFP8'
      }
    } );
  const data = await res.json();
  // iterate data array make sure if user input is not a duplacated input
  for ( let index = 0; index < countryArr.length; index++ ) {
    if ( countryArr[ index ][ "population" ] === data[ 0 ].population ) {
      // delete any old duplated info
      countryArr.splice( index, 1 );
    }
  }
  // update the data array and update lis list
  countryArr.push( { "country": countryName, "population": data[ 0 ].population } );
  // update localstorage with new data array
  setLocalstorage( countryArr );
  // make sure old ul empty and rerender new lis
  $( '.list-group' ).empty();
  updateInfoList( countryArr );
};

// Capitlize first letter of strings
function titleCase ( str ) {
  newStr = str.slice( 0, 1 ).toUpperCase() + str.slice( 1 ).toLowerCase();
  return newStr;
}

// data array initialization
if ( getLocalstorage() === null ) {
  // if localstorage return null make sure initialized data is empty array instead of null
  countryArr = new Array();
} else {
  countryArr = getLocalstorage();
}
// using new country array to rerender ul
updateInfoList( countryArr );




( function () {
  $( "a.search_icon" ).on( "click", function () {
    if ( $( ".search_input" ).val().length > 0 ) {
      let inputValue = $( ".search_input" ).val();
      $( ".search_input" ).val( "" );
      countryDataFetch( inputValue );
    }
  } );
}() );
( function () {
  $( ".search_input" ).keyup( function ( e ) {
    if ( e.keyCode === 13 ) {
      $( "a.search_icon" ).trigger( "click" );
    }
  } );
}() );


( function () {
  $( 'ul.list-group' ).on( 'click', '.delete-btn', function () {
    let deleteMessage = ( $( this ).siblings( '.country' ).text() ).substring( 9 );
    $.each( countryArr, function ( index, ele ) {
      console.log( ele.country, deleteMessage, countryArr );
      if ( ele.country === deleteMessage ) {
        countryArr.splice( index, 1 );
        console.log( countryArr );
        setLocalstorage( countryArr );
        return false;
      }
    } );
    $( this ).parent().stop().slideUp( function () {
      $( this ).remove();
    } );
  } );
}() );



( function () {
  $( ".btn-warning" ).on( 'click', function () {
    let option = {
      title: {
        left: 'center',
        text: 'Population in Different Countries',
        subtext: 'In Millions',
        subtextStyle: {
          color: '#fff'
        },
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {},
      grid: {
        height: 370,
        width: 690,
        top: 70,
        bottom: 60
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
    $.each( countryArr, function ( index, ele ) {
      let pushedStr = titleCase( ele.country );
      option.xAxis.data.push( pushedStr );
      option.series[ 0 ].data.push( ele.population );
    } );
    myChart.setOption( option );
    myChart.dispose;
  } );

}() );
