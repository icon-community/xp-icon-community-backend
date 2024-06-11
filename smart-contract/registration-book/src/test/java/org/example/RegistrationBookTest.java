package org.example;

import com.iconloop.score.test.Account;
import com.iconloop.score.test.Score;
import com.iconloop.score.test.ServiceManager;
import com.iconloop.score.test.TestBase;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import score.UserRevertedException;
import scorex.util.ArrayList;
import score.Address;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

class RegistrationBookTest extends TestBase {
    private static final ServiceManager sm = getServiceManager();
    private static final Account owner = sm.createAccount();
    private static final String trueString = "true";

    private static Score registrationBookScore;
    private static Score registrationBookScore2;
    private static Account luffy;
    private static Account zoro;
    private static Account nami;
    private static Account sanji;

    @BeforeAll
    public static void setup() throws Exception {
        registrationBookScore = sm.deploy(owner, RegistrationBook.class);
        registrationBookScore2 = sm.deploy(owner, RegistrationBook.class);
        luffy = sm.createAccount();
        zoro = sm.createAccount();
        nami = sm.createAccount();
        sanji = sm.createAccount();
        registrationBookScore.invoke(owner, "registerUser", luffy.getAddress());
        registrationBookScore.invoke(owner, "registerUser", zoro.getAddress());
        registrationBookScore.invoke(owner, "registerUser", sanji.getAddress());
        registrationBookScore.invoke(owner, "registerUser", nami.getAddress());
    }

    @Test
    void getRegistrationBookSize() {
        Object size = registrationBookScore.call("getNumberOfUsers");
        int expected = 4;
        assertEquals(expected, size);
    }

    // @Test
    // void getListOfUsers2() {
    //     Object users = registrationBookScore.call("getUsersList");
    //     System.out.println(users);
    //     System.out.println(users.getClass());
    // }
    // @Test
    // void getListOfUsers() {
    //     Object users = registrationBookScore.call("getUsers");
    //     System.out.println(users);
    //     System.out.println(users.getClass());
    //     System.out.println(users.getClass().getName());
    //     // if (users instanceof ArrayList<?>) {
    //     //     ArrayList<?> usersArray = (ArrayList<?>) users;
    //     //     assertEquals(4, usersArray.size());
    //     // } else {
    //     //     throw new AssertionError("users is not a String[]");
    //     // }
    // }

    @Test
    void registerAdmin() {
        registrationBookScore2.invoke(owner, "addAdmin", luffy.getAddress());
        @SuppressWarnings("unchecked")
        List<Address> admins = (List<Address>) registrationBookScore2.call("getAdmins");
        assertEquals(2, admins.size());
        assertEquals(luffy.getAddress().toString(), admins.get(1).toString());
    }

    @Test
    void registerUserByAdmin() {
        registrationBookScore2.invoke(luffy, "registerUser", nami.getAddress());
        Object isUserRegistered = registrationBookScore2.call( 
            "isUserRegistered", nami.getAddress());
        assertEquals(trueString, isUserRegistered);
    }

    @Test
    void registerUserByOwner() {
        registrationBookScore2.invoke(owner, "registerUser", sanji.getAddress());
        Object isUserRegistered = registrationBookScore2.call( 
            "isUserRegistered", sanji.getAddress());
        assertEquals(trueString, isUserRegistered);
    }

    @Test
    void registerUserByOther() {
        assertThrows(UserRevertedException.class, () -> registrationBookScore2.invoke(sanji, "registerUser", nami.getAddress()));
    }
}
