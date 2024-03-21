import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
const Timeline = (embedId) => {
        return (
            <div>
                <VerticalTimeline>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#333', color: '#fff', border: '1px solid #6c757d', borderRadius: '30px', boxShadow: 'none'}}
                        contentArrowStyle={{ borderRight: '7px solid  #6c757d' }}
                        iconStyle={{ background: '#FFF', color: '#262626' }}
                        icon={<div className={'d-flex justify-content-center align-items-center h-100'}><b>1</b></div>}
                    >
                        <p className={'about-us m-2'}>
                            Už pri prvotnej konzultácii sa budeme snažiť vypočuť Vaše predstavy a poradiť tak, aby bol
                            finálny výsledok presne podľa Vašich očakávaní.
                        </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#333', color: '#fff', border: '1px solid #6c757d', borderRadius: '30px', boxShadow: 'none'}}
                        contentArrowStyle={{ borderRight: '7px solid  #6c757d' }}
                        iconStyle={{ background: '#FFF', color: '#262626' }}
                        icon={<div className={'d-flex justify-content-center align-items-center h-100'}><b>2</b></div>}
                    >
                        <p className={'about-us m-2'}>
                            Po odsúhlasení vypracujeme cenovú ponuku a prípadnú vizualizáciu pre ešte lepšiu predstavu.
                        </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#333', color: '#fff', border: '1px solid #6c757d', borderRadius: '30px', boxShadow: 'none'}}
                        contentArrowStyle={{ borderRight: '7px solid  #6c757d' }}
                        iconStyle={{ background: '#FFF', color: '#262626' }}
                        icon={<div className={'d-flex justify-content-center align-items-center h-100'}><b>3</b></div>}
                    >
                        <p className={'about-us m-2'}>
                            V čo najkratšom čase prichádza naskladnenie materiálu a samotná výroba.
                        </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: '#333', color: '#fff', border: '1px solid #6c757d', boxShadow: 'none'}}
                        contentArrowStyle={{ borderRight: '7px solid  #6c757d' }}
                        iconStyle={{ background: '#FFF', color: '#262626' }}
                        icon={<div className={'d-flex justify-content-center align-items-center h-100'}><b>4</b></div>}
                    >
                        <p className={'about-us m-2'}>
                            Ostáva posledný krok nášho procesu a tým je montáž. Vašu zákazku očistíme, zabalíme, dovezieme
                            a všetko poskladáme do finálnej podoby.
                        </p>
                    </VerticalTimelineElement>
                </VerticalTimeline>
                <div className={'text-center mt-5'}>
                    <div className="main-color fst-italic fw-light about-us">
                        "Našou najväčšou radosťou je spokojný zákazník, ktorý odporúča naše služby ostatným.„
                    </div>
                </div>
            </div>
        )
    }
;

export default Timeline;