import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../fbase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const onDelete = async () => {
    const Ok = confirm("Are you sure you want to delete this tweet?");
    if (!Ok) return;
    //  로그인된 유저 ID와 트윗 작성자ID가 같지 않다면, 함수 종료
    if (!Ok || user?.uid !== userId) return;
    try {
      // deleteDoc=> db에서 문서가 어디있는지 찾아내서 문서 삭제
      await deleteDoc(doc(db, "tweets", id));
      //  트윗에 사진 첨부가 되어있는지 확인
      if (photo) {
        // 사진이 있다면 해당 사진에 대한 참조 받아야됨 , firebase/storage에서 불러온 ref 함수 사용
        const photoRef = ref(storage, `twwets/${user.uid}/${id}`);
        // 이미지를 삭제하기 위해서 deleteObject 호출
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {/*  로그인한 유저 ID와 트윗의 유저 ID가 일치할 경우에만 트윗 삭제 가능 
        만약 로그인한 유저 ID와 트윗의 유저 ID가 일치하지 않는다면 버튼 안 보여줌 */}
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </Column>
      {/* photo가 존재하면 보여주고 아니면 꺼져  => Column 안에 연산자 넣어서 사진 없어도 같은 형식으로 보임 */}
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
