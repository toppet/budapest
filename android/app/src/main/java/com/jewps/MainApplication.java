package com.jewps;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.vonovak.AddCalendarEventPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.vonovak.AddCalendarEventPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.vonovak.AddCalendarEventPackage;
import com.vonovak.AddCalendarEventPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeYouTube(),
            new VectorIconsPackage(),
            new MapsPackage(),
            new RNFirebasePackage(),
            new AddCalendarEventPackage(),
            new ReactNativeYouTube(),
            new VectorIconsPackage(),
            new MapsPackage(),
            new RNFirebasePackage(),
            new AddCalendarEventPackage(),
            new ReactNativeYouTube(),
            new VectorIconsPackage(),
            new MapsPackage(),
            new RNFirebasePackage(),
            new AddCalendarEventPackage(),
            new AddCalendarEventPackage(),
            new RNFirebasePackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new ReactNativeYouTube(),
            new VectorIconsPackage(),
            new MapsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
