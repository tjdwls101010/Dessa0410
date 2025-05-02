import { NextRequest, NextResponse } from 'next/server';
import { SolapiMessageService } from 'solapi';

const apiKey = "NCSJHOTCAB2XKMLA";
const apiSecret = "10CNYRHIR5HJYUUYWV3HVELDJYPYRRHL";
const fromNumber = "01068310591";

// 6자리 랜덤 숫자 비밀번호 생성 함수
function generateRandomPassword(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { to, name, preferenceText, reportId } = await req.json();
    
    if (!to || !name) {
      return NextResponse.json(
        { error: '받는 사람 전화번호와 이름이 필요합니다.' }, 
        { status: 400 }
      );
    }
    
    // 6자리 랜덤 비밀번호 생성
    const password = generateRandomPassword();
    
    // 전화번호 하이픈 제거
    const cleanedTo = to.replace(/-/g, '');
    
    // 리포트 링크 생성
    const reportLink = reportId ? `\n\n<리포트 보기>\nhttps://dessa0410.vercel.app/report/${reportId}` : '';
    
    // Solapi 메시지 서비스 초기화
    const messageService = new SolapiMessageService(apiKey, apiSecret);
    
    // SMS 발송 (비밀번호 포함)
    const messageResponse = await messageService.sendOne({
      to: cleanedTo,
      from: fromNumber,
      text: `${name}님의 예약이 접수되었습니다. 
예약 비밀번호는 [${password}]입니다. 
확정 여부는 추후 전화 혹은 문자메세지로 안내드리겠습니다.
감사합니다. 좋은 하루 되세요.${preferenceText ? '\n\n< 예약 선호 시간 >' + preferenceText : ''}${reportLink}`
    });
    
    return NextResponse.json({ 
      success: true, 
      messageId: messageResponse.groupId,
      password: password // 비밀번호를 응답에 포함
    });
    
  } catch (error) {
    console.error('SMS 발송 오류:', error);
    return NextResponse.json(
      { error: '메시지 발송 중 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
} 