package org.example;

import com.iconloop.score.test.Account;
import com.iconloop.score.test.Score;
import com.iconloop.score.test.ServiceManager;
import com.iconloop.score.test.TestBase;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import score.UserRevertedException;
import scorex.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

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
        registrationBookScore.invoke(luffy, "registerUser", luffy.getAddress());
        registrationBookScore.invoke(zoro, "registerUser", zoro.getAddress());
        registrationBookScore.invoke(sanji, "registerUser", sanji.getAddress());
        registrationBookScore.invoke(nami, "registerUser", nami.getAddress());
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
    void registerUserByUser() {
        registrationBookScore2.invoke(nami, "registerUser", nami.getAddress());
        Object isUserRegistered = registrationBookScore2.call( 
            "isUserRegistered", nami.getAddress());
        assertEquals(trueString, isUserRegistered);
    }

    @Test
    void registerUserByOwner() {
        registrationBookScore2.invoke(owner, "registerUser", nami.getAddress());
        Object isUserRegistered = registrationBookScore2.call( 
            "isUserRegistered", nami.getAddress());
        assertEquals(trueString, isUserRegistered);
    }

    @Test
    void registerUserByOther() {
        assertThrows(UserRevertedException.class, () -> registrationBookScore2.invoke(sanji, "registerUser", nami.getAddress()));
    }
}
