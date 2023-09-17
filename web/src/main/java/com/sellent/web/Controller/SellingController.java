package com.sellent.web.Controller;

import com.sellent.web.Entiity.Selling;
import com.sellent.web.Entiity.UserList;
import com.sellent.web.Service.SellingCmtService;
import com.sellent.web.Service.SellingService;
import com.sellent.web.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.ParseException;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@Log4j2
@CrossOrigin(origins = "*")
public class SellingController {

    @Autowired
    SellingService sellingService;
    @Autowired
    SellingCmtService sellingCmtService;
    @Autowired
    UserService userService;

    public UserList userSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        String user = (String) session.getAttribute("userEmail");
        UserList userList = userService.findUserVO(user);
        return userList;
    }

    // 전체 글 목록 조회하기
    @GetMapping("/list")
    public Map<String, Object> selectList() {
        return sellingService.selectList();
    }

    // Method : GET/selling
    // Param : sellIdx
    // 글 읽기
    @GetMapping("/sellent")
    public Map<String, Object> selectContent(@RequestParam String sellIdx) throws Exception {
        Map<String, Object> result = sellingService.selectContent(sellIdx);
        return result;
    }

    // Method : POST
    // Param : sellTitle, sellContent, userEmail, sellType, sellPrice, sellLocation, sellType
    // 글 작성
    @PostMapping("/sellent")
    public void insertContent(@RequestBody Map<String, Object> content, HttpServletRequest request) throws ParseException {
        UserList userList = userSession(request);
        sellingService.insertContent(content, userList);
    }

    // Method : PATCH
    // Param : sellTitle, sellContent, sellPrice, sellLocation
    @PatchMapping("/sellent")
    public Map<String, Object> updateContent(@RequestBody Map<String, Object> content, HttpServletRequest request) throws ParseException {
        UserList userList = userSession(request);
        sellingService.updateContent(content, userList);

        return null;
    }


    //------------------------------------------------
    // 댓글 작성
    // Method : POST
    // Param : sellIdx, sellCmtContent
    @PostMapping("/sellntCmt")
    public void insertComment (@RequestBody Map<String, Object> comment, HttpServletRequest request) throws ParseException {
        System.out.println("=====요청 성공=====");
        UserList userList = userSession(request);
        System.out.println("====="+userList);
        sellingCmtService.insertComment(comment, userList);
    }

    // 댓글 삭제
    // Method : Delete
    // Param : sellCmtIdx
    @DeleteMapping("/sellentCmt")
    public Boolean deleteComment (@RequestParam String sellCmtIdx, HttpServletRequest request) throws ParseException {
        UserList userList = userSession(request);
        int sellentCmtIdx = Integer.parseInt(sellCmtIdx);
        Boolean result = sellingCmtService.deleteComment(sellentCmtIdx, userList);
        return result;
    }
}