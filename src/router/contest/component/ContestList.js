import { useEffect } from "react";
import styled from "styled-components";

const List = styled.ul`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 300px;
    gap: 10px;
    min-width: 700px;
`

const Card = styled.li`
    position: relative;
    border-radius: 5px;
    border: 2px black solid;    
    min-width: 250px;
`

const Img = styled.img`
    width: 100%;
    height: 100%;
    max-width: 100%;
    min-height: 100%;
    border-radius: 5px;
    background-color: aliceblue;
`

const Info = styled.div`
    display: none;
    position: absolute;
    bottom: 0px;
    left: 1px;
    padding: 20px;
    width: 100%;
    height: 40%;
    background-color: rgba(255,255,255, 0.9);
    .info_dday {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    };
    .info_detail {
        h4 {
            padding: 5px;
        }
        p {
            padding: 5px;
        }
    }
    z-index: 3;
`

const cal_remain_day = (startDate) => {
    const currentDate = new Date();
    let remainMillis = startDate - currentDate;
    // 1분은 60000미리초 1시간은 3600000밀리초, 1일은 3600000*24 밀리초

    let remianDay = Math.ceil(remainMillis / (3600000 * 24));
    if (remianDay > 0) {
       
        return `D-${remianDay} Day`;
    } else {
        return `D+${-remianDay}, 진행중`
    }
}

const dateFormat = (startDate, endDate) => {
    let start = new Date(startDate).toLocaleDateString("ko-KR");
    let end = new Date(endDate).toLocaleDateString("ko-KR");
    return `${start} ~ ${end}`;
}


function ContestList({contestDataList}) {

    const onMouseOverCard = (event) => {
        const infoDiv = event.target.nextElementSibling;
        if (infoDiv.style.display === "" || infoDiv.style.display === "none") {
            infoDiv.style.display = "block";
        }
    }

    const onMouseLeaveCard = (event) => {
        const infoDiv = event.target.nextElementSibling;
        if (infoDiv.style.display === "block") {
            infoDiv.style.display = "none";
        }
    }

    useEffect(()=>{
        document.querySelectorAll(".card").forEach((element)=>{
            element.addEventListener("mouseover", onMouseOverCard, true);
            element.addEventListener("mouseleave", onMouseLeaveCard, true);
        })

        return(
            document.querySelectorAll(".card").forEach((element)=>{
                element.removeEventListener("onMouseOver", onMouseOverCard);
                element.removeEventListener("onMouseLeave", onMouseLeaveCard);
            })
        );
    },[])

 
    return(
        <List>
            {contestDataList?.map((contest, index)=>{
                console.log(contest);
                return (
                    <Card key={index}>
                        <Img className="card" src={contest.thumbnail} ></Img>
                        <Info className="card_info">
                            <div className="info_dday">{cal_remain_day(contest.startDate)}</div>
                            <div className="info_detail">
                                <h4>📔 {contest.title}</h4>
                                <p>📅 {dateFormat(contest.startDate, contest.endDate)}</p>
                            </div>
                        </Info>
                    </Card>
                )
            })};
        </List>
    );
};

export default ContestList;