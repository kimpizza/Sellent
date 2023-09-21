import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "../fonts/Font.css";
import "../fonts/Title.css";
import { AiFillCloseCircle } from "react-icons/ai"
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Map from "./Map";
import Swal from "sweetalert2";

const SellentRead = () => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate("/")
    }

    const goLogin = () => {
        navigate("/login")
    }

    const goWrite = () => {
        navigate("/write")
    }

    const goMypage = () => {
        navigate("/mypage")
    }

    const goChat = () => {
        navigate("/chatting")
    }

    const goBack = () => {
        navigate("/background")
    }

    const goSearch = () => {
        navigate("/search")
    }

/* //////////////////////////////////////////////////////////////////////////////////// */

    const {sellIdx} = useParams();
    const [sellentRead, setSellentRead] = useState({});
    const [sellentCommentRead, setSellentCommentRead] = useState([]);
    const [locationX, setLocationX] = useState(null);
    const [locationY, setLocationY] = useState(null);
    const [sellCmtContent, setSellCmtContent] = useState("");
    const [userNm, setUserNm] = useState("");
    const rightBoardRef = useRef(null);

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const response = await axios.get(`/sellent?sellIdx=${sellIdx}`);
                setSellentRead(response.data.Content);
                setSellentCommentRead(response.data.Comment);
                setLocationX(response.data.Location.x);
                setLocationY(response.data.Location.y);

                console.log("게시물 불러오기 성공", sellentRead);
            } catch (error) {
                console.log("게시물 불러오기 실패", error);
            }
        };

        loadBoard();
    }, [sellIdx]);

/* </초기 값 불러오기 끝> */

/* <확인> */

    const sellentUpdate = () => {
        sellentRead.userNm == sessionStorage.getItem("userNm") ?
            navigate(`/sellentUpdate/${sellIdx}`) :
	        Swal.fire('내가 작성한 글만 수정할 수 있습니다.' , '', 'error');
    };

    const sellentDelete = async () => {
        try {
            const result = await Swal.fire({
                title: '글을 삭제하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            });
            if (result.isConfirmed) {
                await axios.delete(`/sellent?sellIdx=${sellIdx}`);
                Swal.fire({
                    title: '삭제되었습니다.',
                    icon: 'success'
                }).then(() => {
                    navigate("/");
                });
            }
        } catch (error) {
            Swal.fire('내가 작성한 글만 삭제할 수 있습니다.', '', 'error');
        }
    };

    useEffect(() => {
        if (rightBoardRef.current) {
            rightBoardRef.current.style.height = rightBoardRef.current.scrollHeight + "px";
        }
    }, [sellentCommentRead]);

    const handleTitleChange = (e) => {
        setSellCmtContent(e.target.value);
    };

    const commentsSubmit = (e) => {
        e.preventDefault();
        if (!sellCmtContent) {
	        Swal.fire('내용을 입력해주세요.');
            return;
        }
        navigate(`/sellentRead/${sellIdx}`)
        axios({
            url: "/sellntCmt",
            method: "post",
            data: {
                sellIdx,
                sellCmtContent,
            }
        })
        .then((response) => {
            console.log(response);
            window.location.reload();
            // 댓글 입력 필드 초기화
            setSellCmtContent("");
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const nickSubmit = (e) => {
        e.preventDefault();
        axios({
        })
    }

    const onDelete = async (sellCmtIdx) => {
        try {
            const result = await Swal.fire({
                title: '댓글을 삭제하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            });
            if (result.isConfirmed) {
                await axios.delete(`/sellentCmt?sellCmtIdx=${sellCmtIdx}`);
                Swal.fire({
                    title: '댓글이 삭제되었습니다.',
                    icon: 'success'
                }).then(() => {
                    window.location.reload();
                });
            }
        }
        catch (error) {
            Swal.fire('내가 작성한 댓글만 삭제할 수 있습니다.', '', 'error');
        }
    };

/* //////////////////////////////////////////////////////////////////////////////////// */

    return (
        <>
            <Window>
                <Close>
                    <AiFillCloseCircle onClick={goBack} />
                </Close>
            </Window>

            <Back>
                <Bind>
                    <Left>
                        <LeftTop onClick={goHome}>SELLENT</LeftTop>
                        <LeftBoardTitle onClick={goLogin}>로그인</LeftBoardTitle>
                        <LeftBoard onClick={goWrite}>재능판매</LeftBoard>
                        <LeftBoard onClick={goSearch} >재능검색</LeftBoard>
                        <LeftBoard onClick={goChat} >채팅내역</LeftBoard>
                        <LeftBoard onClick={goMypage} >마이페이지</LeftBoard>
                        <Cash>25,000원</Cash>
                        <Name>이재호</Name>
                    </Left>

                    <Center>
                        <CenterTopic>{sellentRead.sellType === 0 ? "재능 판매" : "재능 구매"}</CenterTopic>
                        <CenterTitle>{sellentRead.sellTitle}</CenterTitle>
                        <CenterTitle>닉네임 : {sellentRead.userNm}</CenterTitle>
                        <CenterBottomBind>
                            <CenterContents>{sellentRead.sellContent}</CenterContents>
                        </CenterBottomBind>
                        <ButtonBind>
                            <Price> 거래 가격 : {sellentRead.sellPrice}</Price>
                            <Upload onClick={sellentUpdate}>수정하기</Upload>
                            <Cancel onClick={sellentDelete}>삭제하기</Cancel>
                        </ButtonBind>
                        <CenterWhere>거래 장소 : {sellentRead.sellLocation}</CenterWhere>
                        <Map locationX={locationX} locationY={locationY} />
                    </Center>
                    <RightBind>
                        <Right>
                            <RightTop>댓글</RightTop>
                                {sellentCommentRead.length > 0 && sellentCommentRead.map((Comment, index) => {
                                    return (
                                        <RightBoard key={index} ref={rightBoardRef}>
                                            <RightBoardBind>
                                                <RightBoardNick>
                                                    닉네임 : {Comment.userNm}
                                                </RightBoardNick>
                                                <RightBoardDelete onClick={() => onDelete(Comment.sellCmtIdx)} >X</RightBoardDelete>
                                            </RightBoardBind>
                                            {Comment.sellCmtContent}
                                        </RightBoard>
                                    );
                                })}
                        </Right>
                        <RightBottomBind>
                            <RightBottom
                                type="text"
                                placeholder="*댓글을 입력하세요"
                                value={sellCmtContent}
                                onChange={(e) => setSellCmtContent(e.target.value)}
                            />
                            <RightComments onClick={commentsSubmit} >확인</RightComments>
                        </RightBottomBind>
                    </RightBind>
                </Bind>
            </Back>
        </>
    );
}
export default SellentRead;

/* <CSS> */

const Window = styled.div`
    width: 85%;
    height: 3rem;
    border: 2px solid red;
    margin: 0 auto;
    margin-top: 4vh;
    background-color: lightgrey;
`

const Back = styled.div`
    width: 85%;
    height: 85vh;
    border: 2px solid green;
    margin: 0 auto;
    /* margin-top: 8vh; */
`

const Close = styled.div`
    font-size: 3rem;
    display: flex;
    justify-content: right;
`

const Bind = styled.div`
    display: flex;
    justify-content: row;
`

const Left = styled.div`
    width: 15%;
    height: 85vh;
    border: 2px solid black;
    background-color: white;
`

const LeftTop = styled.div`
    width: 100%;
    height: 13vh;
    border-bottom: 2px solid black;
    font-size: 3.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-family: 'Lilita One', cursive;
`

const LeftBoardTitle = styled.div`
    width: 80%;
    height: 6vh;
    border: 2px solid black;
    border-radius: 0.5em;
    margin: 0 auto;
    margin-top: 2rem;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

const LeftBoard = styled.div`
    width: 80%;
    height: 6vh;
    border: 2px solid black;
    border-radius: 0.5em;
    margin: 0 auto;
    margin-top: 2rem;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    @media (max-width: 1280px) {
        /* 화면 너비가 1280px 미만일 때 스타일 적용 */
        font-size: 1.5em; /* 글씨 크기를 줄임 */
    }
    
    @media (max-width: 900px) {
        /* 화면 너비가 1280px 미만일 때 스타일 적용 */
        font-size: 1em; /* 글씨 크기를 줄임 */
    }
`

const Cash = styled.div`
    width: 80%;
    height: 3vh;
    border: 2px solid black;
    margin: 0 auto;
    margin-top: 4em;
    font-size: 2em;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 1400px) {
        /* 화면 너비가 1280px 미만일 때 스타일 적용 */
        font-size: 1.5em; /* 글씨 크기를 줄임 */
    }
    
    @media (max-width: 1080px) {
        /* 화면 너비가 1280px 미만일 때 스타일 적용 */
        font-size: 1em; /* 글씨 크기를 줄임 */
    }
`

const Name = styled.div`
    width: 80%;
    height: 3vh;
    border: 2px solid black;
    margin: 0 auto;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 1280px) {
        /* 화면 너비가 1280px 미만일 때 스타일 적용 */
        font-size: 1.5em; /* 글씨 크기를 줄임 */
    }
    
    @media (max-width: 900px) {
        /* 화면 너비가 1280px 미만일 때 스타일 적용 */
        font-size: 1em; /* 글씨 크기를 줄임 */
    }
`

const Center = styled.div`
    width: 55%;
    height: 85vh;
    border: 2px solid red;
    background-color: white;
    overflow: auto; /* 스크롤 추가 */
    overflow-x: hidden; /* 가로 스크롤 제거 */
`

const Chat = styled.div`
    width: 90%;
    height: 65vh;
    border: 2px solid black;
    margin: 0 auto;
    margin-top: 5rem;
    display: flex;
`

const ChatInput = styled.input`
    width: 90%;
    height: 5vh;
    border: 2px solid blue;
    margin: 0 auto;
    display: flex;
    font-size: 2em;
`

const RightBind = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    border: 2px solid red;
`

const Right = styled.div`
    width: 100%;
    height: 70vh;
    /* border: 2px solid blue; */
    overflow: auto; /* 스크롤 추가 */
    overflow-x: hidden; /* 가로 스크롤 제거 */
    background-color: white;
`

const RightBottomBind = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`

const RightBottom = styled.textarea`
    width: 80%;
    height: 14.5vh;
    /* border: 2px solid red; */
    overflow: auto; /* 스크롤 추가 */
    overflow-x: hidden; /* 가로 스크롤 제거 */
    background-color: white;
    resize: none;
    font-size: 2em;

`

const RightComments = styled.button`
    width: 20%;
    height: 15vh;
    /* border: 2px solid green; */
    background-color: white;
    font-size: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

`

const RightTop = styled.div`
    width: 100%;
    height: 5vh;
    border: 2px solid black;
    font-size: 2.5em;
    margin-top: 0.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bolder;
`

const RightBoard = styled.div`
    width: 90%;
    max-height: 100vh; /* 최대 높이 설정 */
    border: 2px solid black;
    font-size: 1.5em;
    margin: 0 auto;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    white-space: pre-wrap;
    overflow: auto; /* 스크롤 추가 */
    overflow-x: hidden; /* 가로 스크롤 제거 */
`

const RightBoardBind = styled.div`
    display: flex;
    flex-direction: row;
`

const RightBoardNick = styled.div`
    width: 85%;
    height: 3vh;
    font-size: 1em;
    display: flex;
    align-items: center;
    border: 1px solid red;
`

const RightBoardDelete = styled.div`
    width: 15%;
    height: 3vh;
    font-size: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid blue;
    cursor: pointer;
`

const CenterTopic = styled.div`
    width: 90%;
    height: 5vh;
    border: 2px solid red;
    font-size: 2.5em;
    display: flex;
    align-items: center;
    margin-top: 0.5em;
    margin-left: 0.5em;
    font-weight: bolder;
`

const CenterTitle = styled.div`
    width: 90%;
    height: 5vh;
    border: 2px solid red;
    font-size: 2.5em;
    display: flex;
    align-items: center;
    margin-top: 0.5em;
    margin-left: 0.5em;
`

const CenterBottomBind = styled.div`
    display: flex;
    flex-direction: row;
`

const CenterContents = styled.div`
    width: 90%;
    height: 50vh;
    border: 2px solid red;
    font-size: 2.5em;
    display: flex;
    margin-top: 0.5em;
    margin-left: 0.5em;
`

const ButtonBind = styled.div`
    display: flex;
    justify-content: row;
    margin-top: 1em;
`

const Price = styled.div`
    width: 50%;
    height: 5vh;
    border: 2px solid black;
    margin-left: 0.7em;
    font-size: 1.8em;
    display: flex;
    /* justify-content: center; */
    align-items: center;
    font-weight: bold;
`

const Upload = styled.button`
    width: 15%;
    height: 5vh;
    border: 2px solid red;
    font-size: 1.5em;
    margin-left: 2.7em;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
`

const Cancel = styled.button`
    width: 15%;
    height: 5vh;
    border: 2px solid red;
    font-size: 1.5em;
    margin-left: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
`

const CenterWhere = styled.div`
    width: 90%;
    height: 5vh;
    border: 2px solid red;
    font-size: 2.5em;
    display: flex;
    align-items: center;
    margin-top: 0.5em;
    margin-left: 0.5em;
`