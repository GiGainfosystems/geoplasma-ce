import React from 'react'

/**
 * Legend for the virtual borehole
 * @param {} props - The units that are displayed 
 */
function UnitTable(props) {
    const titlefield = 'title_'+props.language
    const descriptionfield = 'description_'+props.language

    let showUnits = false;
    props.units.map(unit => {
        if(unit[descriptionfield] !== '') showUnits = true;
        return unit;
    })
    
    return(
        <div className="units">
            {showUnits &&
                <table className="unit-table" cellSpacing="0">
                <tbody>
                    {props.units.map(unit =>
                        <tr>
                            <td className="unit-color" style={{width: '30px', backgroundColor : unit.color}}>unit</td>
                            <td>
                                <p><strong>{unit[titlefield] !== '' ? unit[titlefield] : unit.title_en}</strong></p>
                                <p>{unit[descriptionfield] !== '' ? unit[descriptionfield] : unit.description_en}</p>
                            </td>
                        </tr>    
                    )}
                </tbody>
            </table>
            }    
        </div>
    )
}

export default UnitTable