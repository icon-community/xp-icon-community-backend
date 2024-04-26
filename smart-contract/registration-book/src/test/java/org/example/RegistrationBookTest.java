package org.example;

import com.iconloop.score.test.Account;
import com.iconloop.score.test.Score;
import com.iconloop.score.test.ServiceManager;
import com.iconloop.score.test.TestBase;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import score.UserRevertedException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RegistrationBookTest extends TestBase {
    private static final ServiceManager sm = getServiceManager();
    private static final Account owner = sm.createAccount();
    private static final String trueString = "true";

    private static Score registrationBookScore;

    @BeforeAll
    public static void setup() throws Exception {
        registrationBookScore = sm.deploy(owner, RegistrationBook.class);
    }

    @Test
    void registerUserByUser() {
        Account alice = sm.createAccount();
        registrationBookScore.invoke(alice, "registerUser", alice.getAddress());
        Object isUserRegistered = registrationBookScore.call( 
            "isUserRegistered", alice.getAddress());
        assertEquals(trueString, isUserRegistered);
    }

    @Test
    void registerUserByOwner() {
        Account alice = sm.createAccount();
        registrationBookScore.invoke(owner, "registerUser", alice.getAddress());
        Object isUserRegistered = registrationBookScore.call( 
            "isUserRegistered", alice.getAddress());
        assertEquals(trueString, isUserRegistered);
    }

    @Test
    void registerUserByOther() {
        Account alice = sm.createAccount();
        Account bob = sm.createAccount();
        assertThrows(UserRevertedException.class, () -> registrationBookScore.invoke(bob, "registerUser", alice.getAddress()));
    }
}
