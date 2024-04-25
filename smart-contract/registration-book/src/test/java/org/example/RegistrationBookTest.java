package org.example;

import com.iconloop.score.test.Account;
import com.iconloop.score.test.Score;
import com.iconloop.score.test.ServiceManager;
import com.iconloop.score.test.TestBase;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class RegistrationBookTest extends TestBase {
    private static final ServiceManager sm = getServiceManager();
    private static final Account owner = sm.createAccount();

    private static Score registrationBookScore;

    @BeforeAll
    public static void setup() throws Exception {
        registrationBookScore = sm.deploy(owner, RegistrationBook.class);
    }

    @Test
    void registerUser() {
        Account alice = sm.createAccount();
        registrationBookScore.invoke(alice, "registerUser", alice.getAddress());
        Object isUserRegistered = registrationBookScore.call( 
            "isUserRegistered", alice.getAddress());
        assertTrue(isUserRegistered.equals("true"));
    }
}
